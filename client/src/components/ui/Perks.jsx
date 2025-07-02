import React from 'react';

const perksList = [
    { name: 'wifi', label: 'Wifi' },
    { name: 'parking', label: 'Free parking spot' },
    { name: 'tv', label: 'TV' },
    { name: 'radio', label: 'Radio' },
    { name: 'pets', label: 'Pets' },
    { name: 'enterence', label: 'Private Enterence' },
];

const Perks = ({ selected, setSelected }) => {
    const handleCheckbox = (e) => {
        const { name, checked } = e.target;
        if (checked) {
            setSelected([...selected, name]);
        } else {
            setSelected(selected.filter((perk) => perk !== name));
        }
    };

    return (
        <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-6">
            {perksList.map((perk) => (
                <label
                    key={perk.name}
                    className="flex cursor-pointer items-center gap-2 rounded-2xl border p-4"
                >
                    <input
                        type="checkbox"
                        checked={selected.includes(perk.name)}
                        name={perk.name}
                        onChange={handleCheckbox}
                    />
                    <span>{perk.label}</span>
                </label>
            ))}
        </div>
    );
};

export default Perks;
