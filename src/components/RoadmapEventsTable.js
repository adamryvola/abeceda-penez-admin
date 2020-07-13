import React, { useState, useEffect, useCallback } from 'react';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import moment from 'moment';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import project from 'ramda/src/project';
import pathOr from 'ramda/src/pathOr';
import toString from 'ramda/src/toString';
import o from 'ramda/src/o';
import compose from 'ramda/src/compose';
import Edit from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import roadmapEventAttributes from '../constants/roadmapEventAttributes';
import Button from '@material-ui/core/Button';
import CreateRoadmapEventModal from './CreateRoadmapEventModal';
import EditRoadmapEventModal from './EditRoadmapEventModal';
import reject from 'ramda/src/reject';
import isNil from 'ramda/src/isNil';
import find from 'ramda/src/find';
import path from 'ramda/src/path';
import indexOf from 'ramda/src/indexOf';
import type from 'ramda/src/type';
import includes from 'ramda/src/includes';
import toLower from 'ramda/src/toLower';
import sort from 'ramda/src/sort';
import reverse from 'ramda/src/reverse';
import addIndex from 'ramda/src/addIndex';
import MUIDataTable from 'mui-datatables';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const mapIndexed = addIndex(map);

const roadmapEventsQueryDef = gql`
    query RoadmapEvents($year: Int){
        roadmapEvents(year: $year) {
            ${roadmapEventAttributes}
        }
    }
`;

const RoadmapEventsTable = ({
    classes,
    client,
}) => {

    const getMuiTheme = () => createMuiTheme({
        typography: {
            useNextVariants: true,
          },
        overrides: {
          MUIDataTableToolbar: {
            root: {
              zIndex: 1000,
              position: "fixed",
              top: "155px",
              float: "right",
              right: "10px",
            }
          },
          MUIDataTableHeadCell: {
              fixedHeaderCommon: {
                  paddingTop: "60px",
              }
          },
          MUIDataTableFilterList: {
              root: {
                  position: "absolute",
                  zIndex: 1001
              }
          },
          MUIDataTablePagination: {
              root: {
                  position: "fixed",
                  right: "10px"
              }
          },
          MUIDataTable: {
              responsiveScroll: {
                  maxHeight: "70vh !important",
              }
          },
        }
      });

    const [createEventModal, setCreateEventModal] = useState(false);
    const [editEventModal, setEditEventModal] = useState(false);
    const [roadmapEventsQuery, setRoadmapsEventsQuery] = useState(null);
    const [year, setYear] = useState(moment().year().toString());

    const loadData = useCallback(() => {
        client.query({
            query: roadmapEventsQueryDef,
            fetchPolicy: 'network-only',
            variables: {
                year: Number(year),
            },
        }).then((res) => {
            console.log('RES', res);
            setRoadmapsEventsQuery(res.data);
        });
    }, [client, year]);

    const initialCols = [
        {
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: 'Region',
            options: {
                filter: true,
            }
        },
        {
            name: 'Segment',
            options: {
                filter: true,
            }
        },
        {
            name: 'Název akce',
            options: {
                filter: false,
            }
        },
        {
            name: 'Datum od-do',
            options: {
                filter: false,
                customBodyRender: ([from, to]) => (
                    `${from !== '?' ? moment(from).format('L LT') : from} - ${to !== '?' ? moment(to).format('L LT') : to }`
                ),
            }
        },
        {
            name: 'Budget MMA',
            options: {
                filter: false,
            }
        },
        {
            name: 'Budget MSE',
            options: {
                filter: false,
            }
        },
        {
            name: 'Budget EXHYP',
            options: {
                filter: false,
            }
        },
        {
            name: 'Nad rámec budgetu',
            options: {
                filter: false,
            }
        },
        {
            name: 'NPS',
            options: {
                filter: false,
            }
        },
        {
            name: 'Hodnocení',
            options: {
                filter: false,
            }
        },
        {
            name: 'Interní klient',
            options: {
                filter: false,
            }
        },
        {
            name: 'Adresa',
            options: {
                filter: false,
                customBodyRender: (address) => (
                    <a rel="noopener noreferrer" target="_blank" href={`https://maps.google.com/?q=${address}`}>
                        {address}
                    </a>
                ),
            }
        },
        {
            name: 'Finanční podklady',
            options: {
                filter: false,
                customBodyRender: (link) => (
                    <a rel="noopener noreferrer"  target="_blank" href={"http://" + link}>
                        ODKAZ
                    </a>
                ),
            }
        },
        {
            name: 'Foto link',
            options: {
                filter: false,
                customBodyRender: (link) => (
                    <a rel="noopener noreferrer"  target="_blank" href={"http://" + link}>
                        ODKAZ
                    </a>
                ),
            }
        },
        {
            name: 'Poznámka',
            options: {
                filter: false,
            }
        },
    ];
    
    const filterCols = JSON.parse(localStorage.getItem('roadmapCols'));
    const filterData = JSON.parse(localStorage.getItem('roadmapFilter'));
    useEffect(() => {
        const cols = [...initialCols];
        if (filterCols || filterData) {
            for (let i = 0; i < filterCols.length; i++) {
               cols[i].options.display = filterCols[i].display;
		    if (filterData) {
		         cols[i].options.filterList = filterData[i].filterList;
		    }
            }
            setColumns(cols);
        } else {
            setColumns(initialCols);
        }
    },[]);


    useEffect(() => {
        loadData();
    }, [loadData]);

    const [columns, setColumns] = useState([]);

    const options = {
        filterType: 'multiselect',
        selectableRows: 'none',
        fixedHeader: true,
        download: false,
        print: false,
        responsive: 'scroll',
        rowsPerPage: 50,
        rowsPerPageOptions: [10, 50, 100, 200, 500, 1000],
        onFilterChange: (column, filterLists) => {
            setColumns(mapIndexed((column, index) => ({
                ...column,
                options: {
                    ...column.options,
                    filterList: filterLists[index],
                }
            }))(columns));

            const toStorage = [];
            for (let i = 0; i < columns.length; i++) {
                toStorage.push({ 
                    name: columns[i].name,
                    filterList:  filterLists[i]
                });
            }
            
            localStorage.setItem('roadmapFilter', JSON.stringify(toStorage));
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
            
            const names = project(['name'], newCols);
            const options = project(['options'], newCols);
            const toStorage = [];
            
            for (let i = 0; i < names.length; i++) {
                toStorage.push({ 
                    name: names[i].name,
                    display:  options[i].options.display
                });
            }
            
            localStorage.setItem('roadmapCols', JSON.stringify(toStorage));

            if (prop('name')(oldSortColumn) !== prop('name')(sortColumn) || path(['options', 'sortDirection'])(oldSortColumn) !== path(['options', 'sortDirection'])(sortColumn)) {
                setColumns(newCols);
            }
        },
        customSearch: (searchQuery, row, columns) => {
            const found = !!find((column) => {
                const columnIndex = indexOf(column)(row);
                if (columns[columnIndex].search) {
                    return columns[columnIndex].search(searchQuery, column);
                }
                if (type(column) === 'String' && column.toLowerCase) {
                    return !!includes(searchQuery.toLowerCase())(column.toLowerCase());
                }
                if (type(column) === 'Array') {
                    return !!find(includes(searchQuery.toLowerCase()))(map(o(toLower, toString))(column));
                }
                return false;
            })(row);
            return !!found;
        },
        customSort: (data, colIndex, order) => {
            switch(colIndex) {
                case 1:
                case 2:
                case 3:
                case 9:
                case 10:
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                    const sorted = sort((a, b) => a.data[colIndex].localeCompare(b.data[colIndex]), data);
                    if (order === 'asc') return sorted;
                    return reverse(sorted);
                case 4:
                    const sortedData = sort((a, b) => {
                        if (a.data[colIndex][0] !== '?' && b.data[colIndex][0] !== '?') {
                            return moment(a.data[colIndex][0]).isBefore(b.data[colIndex][0]);
                        }
                        return 1;
                    }, data);
                    if (order === 'asc') return sortedData;
                    return reverse(sortedData);
                default:
                    break;
            }
            const sorted = sort((a, b) => {
                let intA = 0;
                let intB = 0;
                try {
                    intA = parseInt(a.data[colIndex], 10);
                    intA = isNaN(intA) ? 0 : intA;
                } catch (e) {
                    // nothing..
                }
                try {
                    intB = parseInt(b.data[colIndex], 10);
                    intB = isNaN(intB) ? 0 : intB;
                } catch (e) {
                    // nothing..
                }
                return intA - intB;
            }, data);
            if (order === 'asc') return sorted;
            return reverse(sorted);
        },
        onCellClick: (colData, { colIndex, dataIndex }) => {
            if (colIndex === 12) return;
            if (colIndex === 13) return;
            setEditEventModal(roadmapEventsQuery.roadmapEvents[dataIndex].id)
        }
    };



    if (!roadmapEventsQuery || roadmapEventsQuery.loading) return <CircularProgress />;
    if (roadmapEventsQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <React.Fragment>
            {createEventModal ? (
                <CreateRoadmapEventModal
                    onClose={(refetch) => {
                        setCreateEventModal(false)
                    }}
                />
            ) : null}
            {editEventModal ? (
                <EditRoadmapEventModal
                    onClose={(refetch) => {
                        setEditEventModal(false)
                    }}
                    eventId={editEventModal}
                />
            ) : null} 
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px'}}>
                <div style={{ display: 'flex', position: 'fixed' }}>
                    <FormControl margin="none">
                        <InputLabel htmlFor="year">Rok</InputLabel>
                        <Input
                            id="year"
                            name="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            type="number"
                        />
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => loadData()}
                        style={{ marginLeft: '12px' }}
                    >
                        Načíst akce
                    </Button>
            </div>
            </div>
            <Button
                       variant="contained"
                       color="primary"
                       onClick={() => setCreateEventModal(true)}
                       style={{display: 'flex', padding: '12px', float: 'right', position: 'fixed', right: '47px', top: '100px'}}
                        >
                         Vytvořit akci
             </Button>
        
            <MuiThemeProvider theme={() => getMuiTheme()}>
            <MUIDataTable
                className="roadMapEvents"
                columns={columns}
                options={options}
                data={map((event) => {
                    return [
                        <Edit onClick={() => setEditEventModal(event.id)} />,
                        pathOr('-', ['region'])(event),
                        pathOr('-', ['segment'])(event),
                        pathOr('-', ['name'])(event),
                        [
                            event.from ? moment(event.from) : '?',
                            event.to ? moment(event.to) : '?'
                        ],
                        pathOr('-', ['budgetMMA'])(event),
                        pathOr('-', ['budgetMSE'])(event),
                        pathOr('-', ['budgetEXHYP'])(event),
                        pathOr('-', ['overBudget'])(event),
                        pathOr('-', ['nps'])(event),
                        pathOr('-', ['evaluation'])(event),
                        pathOr('-', ['internalClient'])(event),
                        pathOr('-', ['address'])(event),
                        pathOr('-', ['finMaterial'])(event),
                        pathOr('-', ['photoLink'])(event),
                        pathOr('-', ['note'])(event),
                    ]
                })(roadmapEventsQuery.roadmapEvents || [])}
                />
            </MuiThemeProvider>
        </React.Fragment>
    );
};

export default compose(
    withStyles(styles),
    withApollo,
)(RoadmapEventsTable);
