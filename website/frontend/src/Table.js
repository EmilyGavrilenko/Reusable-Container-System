import React from 'react'
import styled from 'styled-components'
import { useTable, useFilters } from 'react-table'
import moment from 'moment'
import { ColumnFilter } from './ColumnFilter';

const CELL_HEIGHT = 55;

const Styles = styled.div`
  width: 100%; 
  min-width: 1000px;
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 30px;

  table {
    width: 500;
    border-spacing: 0;
    border: 3px solid black;
    font-family: 'Mulish', sans-serif;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      text-align: center;
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      font-size: 20px;
      padding: 7px 20px;
  
      :last-child {
        border-right: 0;
      }
    }
    th {
      height: 40px;
      border-bottom: 3px solid black;
      background: aliceblue;
      color: black;
      fontWeight: bold;
    }
  }
`

const Table = (props) => {
    let columns;
    if (props.type == "transactions") {
        columns = [{
            Header: 'Transaction Data',
            columns: [
            {
                Header: 'User',
                accessor: 'user',
                Filter: ColumnFilter,
                filter: true,
                Cell: row =>  <div style={{ width: 220 }}>{row.row.original.user}</div>
            },
            {
                Header: 'Container',
                accessor: 'container',
                Filter: ColumnFilter,
                filter: true,
                Cell: row => <div style={{ width: 220}}>{row.row.original.container}</div>
            },
            {
                Header: "Date",
                width: '100px',
                textAlign: 'center',
                Cell: row => <div style={{ width: 350 }}>{moment(row.row.original.datetime).format('MMMM Do YYYY, h:mm a')}</div>
            },
            {
                Header: "Type",
                width: '100px',
                textAlign: 'center',
                Cell: row => <div style={{ width: 150 }}>{row.row.original.checkedOut === '0' ? "Return" : "Check out"}</div>
            }
        ],
        }]
    }
    else if (props.type == "users") {
        columns = [{
            Header: 'User Data',
            columns: [
            {
                Header: "User ID",
                accessor: 'ID',
                Filter: ColumnFilter,
                filter: true,
                Cell: row => <div style={{ width: 250}}>{row.row.original.ID}</div>
            },
            {
                Header: 'First Name',
                accessor: 'firstName',
                Cell:  row =>  <div style={{ width: 200 }}>{row.row.original.firstName}</div>
            },
            {
                Header: 'Last Name',
                accessor: 'lastName',
                Cell: row => <div style={{ width: 200}}>{row.row.original.lastName}</div>
            }
        ],
        }]
    }
    else {
        columns = [{
            Header: 'Container Data',
            columns: [
            {
                Header: 'Container ID',
                accessor: 'ID',
                Filter: ColumnFilter,
                filter: true,
                Cell: row => {
                return ( <div style={{ width: 250}}>{row.row.original.ID}</div>) }
            },
            {
                Header: 'Checked Out',
                accessor: 'checkedOut',
                width: 250,
                Cell: row => <div style={{ width: 200}}>{(row.row.original.checkedOut === "1") ? "True" : "False"}</div>
            },
        ],
        }]
    }
  

  return (
  <Styles height={CELL_HEIGHT}>
    <DataTable columns={columns} data={props.data}/>
  </Styles>
  )
}

function DataTable({ columns, data }) {

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow} = useTable({
    columns,
    data,
    },
    useFilters,
    )

  // Render the UI for your table
  return (
  <table {...getTableProps()}>
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>{column.render('Header')}
                <div>{(column.canFilter && column.filter === true) ? column.render('Filter') : null}</div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
    <tbody {...getTableBodyProps()}>
      {rows.map(row => {
        prepareRow(row)
        return (
          <tr {...row.getRowProps()}>
            {row.cells.map(cell => {
              return <td>{cell.render('Cell', {value: cell["value"], original: row["original"]})}</td>
            })}
          </tr>
        )
      })}
    </tbody>
  </table>
 )
}

export default Table;
