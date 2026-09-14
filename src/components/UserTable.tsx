import { useMemo, useState } from 'react'
import type { User } from '../data/mockUsers'
import './UserTable.css'

type UserTableProps = {
    users: User[]
}

type SortKey = 'id' | 'age' | 'sex' | 'subscriptionTier'
type SortDirection = 'asc' | 'desc'

function UserTable({ users }: UserTableProps) {
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [sortKey, setSortKey] = useState<SortKey | null>(null)
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

    const sortedUsers = useMemo(() => {
        if (!sortKey) return users

        return [...users].sort((firstUser, secondUser) => {
            const firstValue = firstUser[sortKey]
            const secondValue = secondUser[sortKey]
            const comparison = typeof firstValue === 'number'
                ? firstValue - (secondValue as number)
                : firstValue.localeCompare(secondValue as string)

            return sortDirection === 'asc' ? comparison : -comparison
        })
    }, [sortDirection, sortKey, users])

    const totalPages = Math.max(1, Math.ceil(sortedUsers.length / pageSize))
    const visibleUsers = sortedUsers.slice((page - 1) * pageSize, page * pageSize)

    const pageNumbers = useMemo(() => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1)
        if (page <= 4) return [1, 2, 3, 4, 5, 'ellipsis', totalPages]
        if (page >= totalPages - 3) return [1, 'ellipsis', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        return [1, 'ellipsis', page - 1, page, page + 1, 'ellipsis', totalPages]
    }, [page, totalPages])

    const handleSort = (key: SortKey) => {
        setSortDirection(currentDirection => (
            sortKey === key && currentDirection === 'asc' ? 'desc' : 'asc'
        ))
        setSortKey(key)
        setPage(1)
    }

    const sortIndicator = (key: SortKey) => {
        if (sortKey !== key) return '↕'
        return sortDirection === 'asc' ? '↑' : '↓'
    }

    return (
        <section className="mock-users">
            <p className="mock-users__title">Thực hành mockup data</p>

            <div className="table-container">
                <table className="user-table">
                    <colgroup>
                        <col className="column-id" />
                        <col className="column-first-name" />
                        <col className="column-last-name" />
                        <col className="column-age" />
                        <col className="column-address" />
                        <col className="column-birthday" />
                        <col className="column-sex" />
                        <col className="column-job" />
                        <col className="column-phone" />
                        <col className="column-tier" />
                        <col className="column-avatar" />
                        <col className="column-action" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th><button type="button" onClick={() => handleSort('id')}>ID <span>{sortIndicator('id')}</span></button></th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th><button type="button" onClick={() => handleSort('age')}>Age <span>{sortIndicator('age')}</span></button></th>
                            <th>Address</th>
                            <th>Birthday</th>
                            <th><button type="button" onClick={() => handleSort('sex')}>Sex <span>{sortIndicator('sex')}</span></button></th>
                            <th>Job Area</th>
                            <th>Phone</th>
                            <th><button type="button" onClick={() => handleSort('subscriptionTier')}>SubscriptionTier <span>{sortIndicator('subscriptionTier')}</span></button></th>
                            <th>Avatar</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {visibleUsers.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>{user.age}</td>
                                <td>{user.address}</td>
                                <td>{user.birthday.toLocaleDateString('en-GB')}</td>
                                <td>{user.sex}</td>
                                <td>{user.jobArea}</td>
                                <td>{user.phone}</td>
                                <td>{user.subscriptionTier}</td>
                                <td>
                                    <a href={user.avatar} target="_blank" rel="noreferrer">
                                        <img src={user.avatar} alt={`${user.firstName} ${user.lastName}`} width={56} height={56} />
                                    </a>
                                </td>
                                <td>
                                    <div className="user-actions">
                                        <button type="button" className="user-actions__invite">Invite {user.lastName}</button>
                                        <button type="button" className="user-actions__delete">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <nav className="pagination" aria-label="Phân trang">
                <button type="button" disabled={page === 1} onClick={() => setPage(currentPage => currentPage - 1)} aria-label="Trang trước">‹</button>
                {pageNumbers.map((pageNumber, index) => (
                    pageNumber === 'ellipsis'
                        ? <span className="pagination__ellipsis" key={`ellipsis-${index}`}>•••</span>
                        : (
                            <button type="button" key={pageNumber} className={pageNumber === page ? 'active' : ''} onClick={() => setPage(Number(pageNumber))}>
                                {pageNumber}
                            </button>
                        )
                ))}
                <button type="button" disabled={page === totalPages} onClick={() => setPage(currentPage => currentPage + 1)} aria-label="Trang sau">›</button>
                <select
                    value={pageSize}
                    aria-label="Số dòng mỗi trang"
                    onChange={(event) => {
                        setPageSize(Number(event.target.value))
                        setPage(1)
                    }}
                >
                    {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size} / page</option>)}
                </select>
            </nav>
        </section>
    )
}

export default UserTable
