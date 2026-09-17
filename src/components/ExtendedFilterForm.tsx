import { useEffect, useState, type FormEvent } from 'react'
import { Select } from 'antd'
import { useSearchParams } from 'react-router-dom'
import './ExtendedFilterForm.css'
import type {
    FilterCondition,
    FilterFormValues,
    FilterQuery,
} from '../types/Filter'

const FIELD_OPTIONS = [
    'FIRST_NAME',
    'LAST_NAME',
    'BIRTH_YEAR',
    'PERSONAL_NUMBER',
    'GENDER',
    'DATE_RECORDED',
    'BUSINESS_AREA',
    'COUNTRY',
    'EMPLOYER',
    'MANAGERIAL_POSITION',
    'ZIPCODE',
    'LINKED_LN_LINK',
    'FIRST_EMPLOYMENT',
    'PHONE_NUMBER',
    'SECOND_PHONE_NUMBER',
    'EMAIL_WORK',
    'CREATED_BY',
].map((value) => ({ value, label: value }))

const CONDITION_OPTIONS = [
    'IS',
    'IS_NOT',
    'CONTAINS',
    'NOT_CONTAINS',
    'GREATER_THAN',
    'LESS_THAN',
].map((value) => ({ value, label: value }))

const TAG_OPTIONS = [
    { value: '1', label: 'kylapplikationer' },
    { value: '3', label: 'program' },
    { value: '4', label: 'inklusive' },
    { value: '5', label: 'komplett' },
    { value: '6', label: 'vid' },
    { value: '8', label: 'bygghandling' },
    { value: '9', label: 'planlösningar' },
    { value: '10', label: 'sweden' },
    { value: '11', label: 'och' },
    { value: '12', label: 'fortsättningskurs' },
    { value: '13', label: 'diverse' },
    { value: '14', label: 'stockholmskontoret' },
    { value: '15', label: 'marknader' },
    { value: '16', label: 'meeting' },
    { value: '17', label: 'svärdfisken' },
    { value: '19', label: 'åf' },
    { value: '20', label: 'projektering' },
    { value: '21', label: 'för' },
    { value: '22', label: 'fönsterrenoveringsprojekt' },
    { value: '23', label: 'var' },
    { value: '24', label: 'byte' },
    { value: '25', label: 'tekniska' },
    { value: '26', label: 'kursen' },
    { value: '27', label: 'reglerteknik' },
    { value: '28', label: 'planering' },
    { value: '29', label: 'kylsystem' },
    { value: '30', label: 'grundläggande' },
    { value: '31', label: 'år' },
    { value: '32', label: 'energioptimering' },
]

const EMPTY_CONDITION: FilterCondition = {
    field: '',
    condition: '',
    value: '',
    operator: 'AND',
}

const DEFAULT_FORM_VALUES: FilterFormValues = {
    freeText: '',
    tags: [],
    conditions: [{ ...EMPTY_CONDITION }],
}

function createFilterQuery(values: FilterFormValues): FilterQuery {
    const validConditions = values.conditions.filter(
        ({ field, condition, value }) =>
            field && condition && value.trim(),
    )

    return {
        freeText: values.freeText.trim(),
        filterWithConditions: validConditions.map(
            ({ field, condition, value }) => ({
                field,
                condition,
                value: value.trim(),
            }),
        ),
        operatorsOrder: validConditions
            .slice(0, -1)
            .map(({ operator }) => operator),
    }
}

function parseJson(value: string | null): unknown {
    if (value === null) {
        return null
    }

    try {
        return JSON.parse(value)
    } catch {
        return null
    }
}

function isFilterQuery(value: unknown): value is FilterQuery {
    if (typeof value !== 'object' || value === null) {
        return false
    }

    const query = value as Record<string, unknown>

    return (
        typeof query.freeText === 'string' &&
        Array.isArray(query.filterWithConditions) &&
        query.filterWithConditions.every((item: unknown) => {
            if (typeof item !== 'object' || item === null) {
                return false
            }

            const condition = item as Record<string, unknown>
            return (
                typeof condition.field === 'string' &&
                typeof condition.condition === 'string' &&
                typeof condition.value === 'string'
            )
        }) &&
        Array.isArray(query.operatorsOrder) &&
        query.operatorsOrder.length ===
        Math.max(0, query.filterWithConditions.length - 1) &&
        query.operatorsOrder.every(
            (operator: unknown) => operator === 'AND' || operator === 'OR',
        )
    )
}

function ExtendedFilterForm() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [formValues, setFormValues] =
        useState<FilterFormValues>(DEFAULT_FORM_VALUES)
    const [submittedFilter, setSubmittedFilter] = useState('')
    const [submittedTags, setSubmittedTags] = useState<string[]>([])

    useEffect(() => {
        const filterFromUrl = parseJson(searchParams.get('filter'))
        const tagsFromUrl = parseJson(searchParams.get('tags'))
        const filter = isFilterQuery(filterFromUrl) ? filterFromUrl : null
        const tags = Array.isArray(tagsFromUrl)
            ? tagsFromUrl.filter(
                (tag): tag is string =>
                    typeof tag === 'string' &&
                    TAG_OPTIONS.some((option) => option.value === tag),
            )
            : []

        const conditions: FilterCondition[] = filter
            ? filter.filterWithConditions.map((condition, index) => ({
                ...condition,
                operator: filter.operatorsOrder[index] ?? 'AND',
            }))
            : []

        setFormValues({
            freeText: filter?.freeText ?? '',
            tags,
            conditions: conditions.length > 0
                ? conditions
                : [{ ...EMPTY_CONDITION }],
        })
        setSubmittedFilter(filter ? JSON.stringify(filter, null, 2) : '')
        setSubmittedTags(tags)
    }, [searchParams])

    const updateCondition = (
        index: number,
        key: keyof FilterCondition,
        value: string,
    ) => {
        setFormValues((current) => ({
            ...current,
            conditions: current.conditions.map(
                (condition, conditionIndex) =>
                    conditionIndex === index
                        ? { ...condition, [key]: value }
                        : condition,
            ),
        }))
    }

    const addCondition = () => {
        setFormValues((current) => ({
            ...current,
            conditions: [
                ...current.conditions,
                { ...EMPTY_CONDITION },
            ],
        }))
    }

    const removeCondition = (index: number) => {
        setFormValues((current) => {
            if (current.conditions.length === 1) {
                return current
            }

            return {
                ...current,
                conditions: current.conditions.filter(
                    (_, conditionIndex) => conditionIndex !== index,
                ),
            }
        })
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        const filterQuery = createFilterQuery(formValues)
        setSearchParams({
            filter: JSON.stringify(filterQuery),
            tags: JSON.stringify(formValues.tags),
        })
        setSubmittedFilter(JSON.stringify(filterQuery, null, 2))
        setSubmittedTags([...formValues.tags])
    }

    const handleClear = () => {
        setFormValues({
            freeText: '',
            tags: [],
            conditions: [{ ...EMPTY_CONDITION }],
        })
        setSubmittedFilter('')
        setSubmittedTags([])
        setSearchParams({})
    }

    const submittedTagLabels = TAG_OPTIONS
        .filter((tag) => submittedTags.includes(tag.value))
        .map((tag) => tag.label)
        .join(', ')

    return (
        <section>
            <h1>Thực hành extend form</h1>

            <form className="extended-filter-form" onSubmit={handleSubmit}>
                <h2>Filter</h2>
                <div className="extended-filter-top">
                    <label>
                        Search
                        <input
                            type="text"
                            value={formValues.freeText}
                            onChange={(event) => {
                                setFormValues((current) => ({
                                    ...current,
                                    freeText: event.target.value,
                                }))
                            }}
                        />
                    </label>

                    <div className="extended-filter-tags">
                        <label htmlFor="extended-filter-tags">Tag</label>
                        <Select
                            id="extended-filter-tags"
                            className="extended-filter-tags-select"
                            mode="multiple"
                            showSearch
                            allowClear
                            optionFilterProp="label"
                            placeholder="Tag"
                            options={TAG_OPTIONS}
                            value={formValues.tags}
                            onChange={(tags: string[]) => {
                                setFormValues((current) => ({
                                    ...current,
                                    tags,
                                }))
                            }}
                        />
                    </div>
                </div>


                <p className="extended-filter-conditions-label">Show Only Records With</p>

                {formValues.conditions.map((filterCondition, index) => (
                    <div key={index}>
                        <div className="extended-filter-condition-row">
                            <Select
                                size="large"
                                showSearch={{
                                    optionFilterProp: 'label',
                                }}
                                allowClear
                                placeholder="Columns"
                                options={FIELD_OPTIONS}
                                value={filterCondition.field || undefined}
                                onChange={(field: string | undefined) => {
                                    updateCondition(index, 'field', field ?? '')
                                }}
                            />

                            <span> That </span>

                            <Select
                                size="large"
                                showSearch={{
                                    optionFilterProp: 'label',
                                }}
                                allowClear
                                placeholder="Is"
                                options={CONDITION_OPTIONS}
                                value={filterCondition.condition || undefined}
                                onChange={(condition: string | undefined) => {
                                    updateCondition(index, 'condition', condition ?? '')
                                }}
                            />

                            <input
                                type="text"
                                placeholder="Text"
                                value={filterCondition.value}
                                disabled={!filterCondition.field || !filterCondition.condition}
                                onChange={(event) => {
                                    updateCondition(index, 'value', event.target.value)
                                }}
                            />

                            {formValues.conditions.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        removeCondition(index)
                                    }}
                                >
                                    Remove
                                </button>
                            )}
                        </div>

                        {index < formValues.conditions.length - 1 && (
                            <div>
                                <label>
                                    <input
                                        type="radio"
                                        name={`operator-${index}`}
                                        checked={filterCondition.operator === 'AND'}
                                        onChange={() => {
                                            updateCondition(index, 'operator', 'AND')
                                        }}
                                    />
                                    AND
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name={`operator-${index}`}
                                        checked={filterCondition.operator === 'OR'}
                                        onChange={() => {
                                            updateCondition(index, 'operator', 'OR')
                                        }}
                                    />
                                    OR
                                </label>
                            </div>
                        )}

                    </div>
                ))}

                <button
                    className="extended-filter-more"
                    type="button"
                    onClick={addCondition}
                >
                    + More Filter
                </button>

                <div className="extended-filter-actions">
                    <button className="extended-filter-submit" type="submit">
                        Filter
                    </button>
                    <button className="extended-filter-clear" type="button" onClick={handleClear}>
                        Clear
                    </button>
                </div>
            </form>

            <table className="extended-filter-result">
                <thead>
                    <tr>
                        <th>Filter</th>
                        <th>Tags</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <pre>{submittedFilter}</pre>
                        </td>
                        <td>
                            {submittedTagLabels}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    )
}

export default ExtendedFilterForm
