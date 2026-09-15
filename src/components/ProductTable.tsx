import axios from 'axios'
import { Pagination } from 'antd'
import {
    type ReactNode,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product, ProductResponse } from '../types/Product'
import './ProductTable.css'

type ProductColumn = Extract<keyof Product, string>

const DEFAULT_COLUMNS: ProductColumn[] = [
    'id',
    'title',
    'description',
    'price',
    'brand',
    'rating',
    'thumbnail',
]

const ALL_COLUMNS: ProductColumn[] = [
    'id',
    'title',
    'description',
    'category',
    'price',
    'discountPercentage',
    'rating',
    'stock',
    'tags',
    'brand',
    'sku',
    'weight',
    'dimensions',
    'warrantyInformation',
    'shippingInformation',
    'availabilityStatus',
    'reviews',
    'returnPolicy',
    'minimumOrderQuantity',
    'meta',
    'thumbnail',
    'images',
]

const SELECTED_COLUMNS_KEY = 'selectedColumns'

function isProductColumn(value: unknown): value is ProductColumn {
    return (
        typeof value === 'string' &&
        (ALL_COLUMNS as string[]).includes(value)
    )
}

function getSavedColumns(): ProductColumn[] {
    const savedColumns = localStorage.getItem(SELECTED_COLUMNS_KEY)

    if (!savedColumns) {
        return DEFAULT_COLUMNS
    }

    try {
        const parsedColumns: unknown = JSON.parse(savedColumns)

        if (!Array.isArray(parsedColumns)) {
            return DEFAULT_COLUMNS
        }

        const validColumns = parsedColumns.filter(isProductColumn)
        return validColumns.length > 0 ? validColumns : DEFAULT_COLUMNS
    } catch {
        return DEFAULT_COLUMNS
    }
}

function getColumnLabel(column: ProductColumn) {
    const label = column.replace(/([A-Z])/g, ' $1')
    return label.charAt(0).toUpperCase() + label.slice(1)
}

function renderProductCell(
    product: Product,
    column: ProductColumn,
): ReactNode {
    switch (column) {
        case 'description':
            return (
                <p className="product-description">
                    {product.description}
                </p>
            )
        case 'price':
            return `$${product.price.toFixed(2)}`
        case 'discountPercentage':
            return `${product.discountPercentage.toFixed(2)}%`
        case 'brand':
            return product.brand ?? '-'
        case 'thumbnail':
            return (
                <img
                    className="product-thumbnail"
                    src={product.thumbnail}
                    alt={product.title}
                    title={product.title}
                />
            )
        case 'images':
            return `${product.images.length} images`
        case 'tags':
            return product.tags.join(', ')
        case 'dimensions':
            return (
                `${product.dimensions.width} × ` +
                `${product.dimensions.height} × ` +
                product.dimensions.depth
            )
        case 'reviews':
            return `${product.reviews.length} reviews`
        case 'meta':
            return product.meta.barcode
        default:
            return String(product[column] ?? '-')
    }
}

function ProductTable() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [total, setTotal] = useState(0)
    const [selectedColumns, setSelectedColumns] =
        useState<ProductColumn[]>(getSavedColumns)
    const [draftColumns, setDraftColumns] =
        useState<ProductColumn[]>(selectedColumns)
    const [columnSearch, setColumnSearch] = useState('')
    const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false)
    const [draggedColumn, setDraggedColumn] =
        useState<ProductColumn | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()
    const columnMenuRef = useRef<HTMLDivElement>(null)

    const page = Math.max(1, Number(searchParams.get('page')) || 1)
    const pageSize = Math.max(1, Number(searchParams.get('size')) || 20)

    const filteredColumns = useMemo(
        () =>
            ALL_COLUMNS.filter((column) =>
                getColumnLabel(column)
                    .toLowerCase()
                    .includes(columnSearch.trim().toLowerCase()),
            ),
        [columnSearch],
    )

    useEffect(() => {
        const controller = new AbortController()

        const fetchProducts = async () => {
            setLoading(true)
            setError('')

            try {
                const skip = (page - 1) * pageSize
                const response = await axios.get<ProductResponse>(
                    `https://dummyjson.com/products?skip=${skip}&limit=${pageSize}`,
                    { signal: controller.signal },
                )

                setProducts(response.data.products)
                setTotal(response.data.total)
            } catch {
                if (!controller.signal.aborted) {
                    setError('Không thể tải danh sách sản phẩm')
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false)
                }
            }
        }

        fetchProducts()

        return () => {
            controller.abort()
        }
    }, [page, pageSize])

    useEffect(() => {
        const closeColumnMenu = (event: MouseEvent) => {
            if (
                columnMenuRef.current &&
                !columnMenuRef.current.contains(event.target as Node)
            ) {
                setIsColumnMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', closeColumnMenu)

        return () => {
            document.removeEventListener('mousedown', closeColumnMenu)
        }
    }, [])

    const openColumnMenu = () => {
        setDraftColumns(selectedColumns)
        setColumnSearch('')
        setIsColumnMenuOpen(true)
    }

    const toggleColumn = (column: ProductColumn, checked: boolean) => {
        setDraftColumns((currentColumns) => {
            if (checked) {
                return currentColumns.includes(column)
                    ? currentColumns
                    : [...currentColumns, column]
            }

            return currentColumns.filter(
                (currentColumn) => currentColumn !== column,
            )
        })
    }

    const saveSelectedColumns = () => {
        setSelectedColumns(draftColumns)
        localStorage.setItem(
            SELECTED_COLUMNS_KEY,
            JSON.stringify(draftColumns),
        )
        setIsColumnMenuOpen(false)
    }

    const moveColumn = (targetColumn: ProductColumn) => {
        if (!draggedColumn || draggedColumn === targetColumn) {
            return
        }

        const reorderedColumns = [...selectedColumns]
        const draggedIndex = reorderedColumns.indexOf(draggedColumn)
        const targetIndex = reorderedColumns.indexOf(targetColumn)

        reorderedColumns.splice(draggedIndex, 1)
        reorderedColumns.splice(targetIndex, 0, draggedColumn)

        setSelectedColumns(reorderedColumns)
        localStorage.setItem(
            SELECTED_COLUMNS_KEY,
            JSON.stringify(reorderedColumns),
        )
        setDraggedColumn(null)
    }

    if (loading) {
        return <p className="product-status">Loading...</p>
    }

    if (error) {
        return <p className="product-status product-error">{error}</p>
    }

    return (
        <div className="product-table">
            <div className="product-toolbar">
                <div className="column-picker" ref={columnMenuRef}>
                    <button
                        className="column-picker-trigger"
                        type="button"
                        aria-expanded={isColumnMenuOpen}
                        onClick={() => {
                            if (isColumnMenuOpen) {
                                setIsColumnMenuOpen(false)
                            } else {
                                openColumnMenu()
                            }
                        }}
                    >
                        Columns <span aria-hidden="true">⌄</span>
                    </button>

                    {isColumnMenuOpen && (
                        <div className="column-menu">
                            <div className="column-menu-header">
                                <h2>Columns</h2>
                                <input
                                    type="search"
                                    value={columnSearch}
                                    placeholder="Search"
                                    aria-label="Search columns"
                                    onChange={(event) => {
                                        setColumnSearch(event.target.value)
                                    }}
                                />
                            </div>

                            <div className="column-options">
                                <button
                                    className="restore-columns"
                                    type="button"
                                    onClick={() => {
                                        setDraftColumns(DEFAULT_COLUMNS)
                                    }}
                                >
                                    Restore Defaults
                                </button>

                                {filteredColumns.map((column) => (
                                    <label key={column}>
                                        <input
                                            type="checkbox"
                                            checked={draftColumns.includes(
                                                column,
                                            )}
                                            onChange={(event) => {
                                                toggleColumn(
                                                    column,
                                                    event.target.checked,
                                                )
                                            }}
                                        />
                                        <span>{getColumnLabel(column)}</span>
                                    </label>
                                ))}
                            </div>

                            <div className="column-menu-actions">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsColumnMenuOpen(false)
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={draftColumns.length === 0}
                                    onClick={saveSelectedColumns}
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                <Pagination
                    current={page}
                    pageSize={pageSize}
                    total={total}
                    showSizeChanger
                    pageSizeOptions={[10, 20, 30, 50, 80, 100]}
                    showTotal={(productTotal, range) =>
                        `${range[0]}-${range[1]} of ${productTotal} items`
                    }
                    onChange={(nextPage, nextPageSize) => {
                        const sizeChanged = nextPageSize !== pageSize

                        setSearchParams({
                            page: String(sizeChanged ? 1 : nextPage),
                            size: String(nextPageSize),
                        })
                    }}
                />
            </div>

            <div className="product-table-scroll">
                <table>
                    <thead>
                        <tr>
                            {selectedColumns.map((column) => (
                                <th
                                    key={column}
                                    draggable
                                    onDragStart={() => {
                                        setDraggedColumn(column)
                                    }}
                                    onDragOver={(event) => {
                                        event.preventDefault()
                                    }}
                                    onDrop={() => {
                                        moveColumn(column)
                                    }}
                                    onDragEnd={() => {
                                        setDraggedColumn(null)
                                    }}
                                >
                                    {getColumnLabel(column)}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                {selectedColumns.map((column) => (
                                    <td key={column}>
                                        {renderProductCell(product, column)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProductTable
