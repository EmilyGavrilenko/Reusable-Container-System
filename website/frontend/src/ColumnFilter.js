import React from 'react'
import { Input } from 'semantic-ui-react'

export const ColumnFilter = ({ column }) => {
    const {filterValue, setFilter } = column
    return (
        <span>
            <Input
                placeholder="Search"
                size="mini"
                value={filterValue || ''}
                onChange={(e) => setFilter(e.target.value)}
                style={{background: '#FFFFFF', marginTop: "5px"}}
            />
        </span>
    )
}