import React, { useState } from 'react';

const FilterSize = () => {
    const [checkedStates, setCheckedStates] = useState({
        size1: false,
        size2: true, 
        size3: false,
        size4: false,
    });

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckedStates((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    };

    return (
        <div className="filter-size">
            <label className="checkbox-single">
                <span className="d-flex gap-xl-3 gap-2 align-items-center">
                    <span className="checkbox-area d-center">
                        <input
                            type="checkbox"
                            name="size1"
                            checked={checkedStates.size1}
                            onChange={handleCheckboxChange}
                        />
                        <span className="checkmark d-center"></span>
                    </span>
                    <span className="text-color">S</span>
                </span>
            </label>

            <label className="checkbox-single">
                <span className="d-flex gap-xl-3 gap-2 align-items-center">
                    <span className="checkbox-area d-center">
                        <input
                            type="checkbox"
                            name="size2"
                            checked={checkedStates.size2}
                            onChange={handleCheckboxChange}
                        />
                        <span className="checkmark d-center"></span>
                    </span>
                    <span className="text-color">M</span>
                </span>
            </label>

            <label className="checkbox-single">
                <span className="d-flex gap-xl-3 gap-2 align-items-center">
                    <span className="checkbox-area d-center">
                        <input
                            type="checkbox"
                            name="size3"
                            checked={checkedStates.size3}
                            onChange={handleCheckboxChange}
                        />
                        <span className="checkmark d-center"></span>
                    </span>
                    <span className="text-color">L</span>
                </span>
            </label>

            <label className="checkbox-single">
                <span className="d-flex gap-xl-3 gap-2 align-items-center">
                    <span className="checkbox-area d-center">
                        <input
                            type="checkbox"
                            name="size4"
                            checked={checkedStates.size4}
                            onChange={handleCheckboxChange}
                        />
                        <span className="checkmark d-center"></span>
                    </span>
                    <span className="text-color">XL</span>
                </span>
            </label>
        </div>
    );
};

export default FilterSize;
