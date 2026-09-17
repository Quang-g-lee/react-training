export type LogicalOperator = 'AND' | 'OR'

export type FilterCondition = {
    field: string
    condition: string
    value: string
    operator: LogicalOperator
}

export type FilterFormValues = {
    freeText: string
    tags: string[]
    conditions: FilterCondition[]
}

export type FilterQuery = {
    freeText: string
    filterWithConditions: Array<{
        field: string
        condition: string
        value: string
    }>
    operatorsOrder: LogicalOperator[]
}
