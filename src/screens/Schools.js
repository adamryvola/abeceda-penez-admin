import React, { useState } from 'react';
import Layout from '../components/Layout';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import MUIDataTable from 'mui-datatables';
import Button from '@material-ui/core/Button';
import schoolAttributes from '../constants/schoolAttributes';
import reject from 'ramda/src/reject';
import isNil from 'ramda/src/isNil';
import find from 'ramda/src/find';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import join from 'ramda/src/join';
import map from 'ramda/src/map';
import addIndex from 'ramda/src/addIndex';
import Edit from '@material-ui/icons/Edit';
import pathOr from 'ramda/src/pathOr';
import CreateSchoolModal from '../components/CreateSchoolModal';
import EditSchoolModal from '../components/EditSchoolModal';

const mapIndexed = addIndex(map);


const Schools = ({ schoolsQuery }) => {
    const [createSchool, setCreateSchool] = useState(false);
    const [editSchool, setEditSchool] = useState(null);
    const [columns, setColumns] = useState([
        {
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: 'Název',
            options: {
                filter: false,
                sortDirection: 'asc',
            }
        },
        {
            name: 'Region',
            options: {
                filter: true,
            }
        },
        {
            name: 'Poznamka',
            options: {
                filter: false,
            }
        },
        {
            name: 'Adresa',
            options: {
                filter: false,
            }
        },
        {
            name: 'Stav',
            options: {
                filter: true,
            }
        },
    ]);

    const options = {
        filterType: 'multiselect',
        selectableRows: 'none',
        fixedHeader: true,
        download: false,
        print: false,
        responsive: 'scroll',
        rowsPerPage: 1000,
        rowsPerPageOptions: [10, 50, 100, 200, 500, 1000],
        onFilterChange: (column, filterLists) => {
            setColumns(mapIndexed((column, index) => ({
                ...column,
                options: {
                    ...column.options,
                    filterList: filterLists[index],
                }
            }))(columns));
        },
        onTableChange: (actionName, tableData) => {
            const newCols = mapIndexed((column, index) => ({
                name: column.name,
                options: {
                    ...reject(isNil)(column),
                    filteredList: columns[index].filteredList,
                }
            }))(tableData.columns);
            const sortColumn = find((col) => !!path(['options', 'sortDirection'])(col))(newCols);
            const oldSortColumn = find((col) => !!path(['options', 'sortDirection'])(col))(columns);

            if (prop('name')(oldSortColumn) !== prop('name')(sortColumn) || path(['options', 'sortDirection'])(oldSortColumn) !== path(['options', 'sortDirection'])(sortColumn)) {
                setColumns(newCols);
            }
        },
        onCellClick: (colData, { colIndex, dataIndex }) => {
            // TODO
        }
    };

    return (
        <Layout title="Školy">
            {createSchool ? (
                <CreateSchoolModal
                    onClose={() => {
                        schoolsQuery.refetch();
                        setCreateSchool(false);
                    }}
                />
            ) : null}
            {editSchool ? (
                <EditSchoolModal
                    id={editSchool}
                    onClose={(refetch) => {
                        // maybe re-fetch?
                        setEditSchool(null);
                    }}
                />
            ) : null}
            <div style={{ padding: '12px' }}>
                <Button
                    onClick={() => setCreateSchool(true)}
                    variant="contained"
                    color="primary"
                >
                    Vytvořit školu
                </Button>
            </div>
            <MUIDataTable
                columns={columns}
                options={options}
                data={map((school) => {
                    return [
                        <Edit onClick={() => { setEditSchool(school.id) }} />,
                        pathOr('-', ['name'])(school),
                        pathOr('-', ['region'])(school),
                        pathOr('-', ['note'])(school),
                        join(', ')([
                            prop('street')(school),
                            prop('city')(school)
                        ]),
                        pathOr('-', ['status'])(school),
                    ]
                })(schoolsQuery.schools || [])}
            />
        </Layout>
    );
};

Schools.propTypes = {

};

const schoolsQuery = graphql(gql`
    {
        schools {
            ${schoolAttributes}
        }
    }
`, {
    name: 'schoolsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default schoolsQuery(Schools);
