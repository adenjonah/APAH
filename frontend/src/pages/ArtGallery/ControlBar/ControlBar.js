import React, { useState } from 'react';
import SearchComponent from './SearchComponent';
import ActiveFiltersComponent from './ActiveFiltersComponent';
import "./ControlBar.css";

function ControlBar({
    search,
    setSearch,
    layout,
    setLayout,
    setSort,
    sort,
    unitFilters,
    setUnitFilters,
    searchBy,
    setSearchBy
}) {
    const [clearFilters, setClearFilters] = useState(true);

    const handleClearFilters = () => {
        setUnitFilters({
            unit1: false, unit2: false, unit3: false, unit4: false,
            unit5: false, unit6: false, unit7: false, unit8: false
        });
        setSort('ID Ascending');
        setSearch('');
        setClearFilters(true);
    };

    // const toggleLayout = () => {
    //     setLayout(prevLayout => prevLayout === 'column' ? 'table' : 'column');
    // };

    // Check if any filters are active
    const areFiltersActive = Object.values(unitFilters).some(filter => filter);

    return (
        <div className="control-bar-container">
            <div className="control-bar">
                <SearchComponent
                    search={search}
                    setSearch={setSearch}
                    setClearFilters={setClearFilters}
                    unitFilters={unitFilters}
                    setUnitFilters={setUnitFilters}
                    sort={sort}
                    setSort={setSort}
                    searchBy={searchBy}
                    setSearchBy={setSearchBy}
                />
                {areFiltersActive && (
                    <ActiveFiltersComponent
                        unitFilters={unitFilters}
                        handleClearFilters={handleClearFilters}
                        clearFilters={clearFilters}
                    />
                )}

                {/* <div className="toggle-layout-container">
                    <button className="layout-toggle-button" onClick={toggleLayout}>
                        {layout === 'table' ? 'Switch to Column' : 'Switch to Grid'}
                    </button>
                </div> */}
            </div>
        </div>
    );
}

export default ControlBar;