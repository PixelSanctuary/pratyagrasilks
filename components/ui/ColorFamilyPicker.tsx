'use client';

import { COLOR_FAMILIES, LIGHT_COLOR_IDS } from '@/lib/constants/colors';

interface ColorFamilyPickerProps {
    value: string;
    onChange: (id: string) => void;
    size?: 'sm' | 'md';
}

export default function ColorFamilyPicker({ value, onChange, size = 'md' }: ColorFamilyPickerProps) {
    const dim = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';

    return (
        <div className="flex flex-wrap gap-2">
            {COLOR_FAMILIES.map(({ id, name, hex }) => {
                const isSelected = value === id;
                const isLight = LIGHT_COLOR_IDS.has(id);

                return (
                    <button
                        key={id}
                        type="button"
                        title={name}
                        aria-label={name}
                        aria-pressed={isSelected}
                        onClick={() => onChange(isSelected ? '' : id)}
                        className={[
                            dim,
                            'rounded-full transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-black',
                            isLight ? 'ring-1 ring-gray-300' : '',
                            isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105',
                        ].join(' ')}
                        style={{ backgroundColor: hex }}
                    />
                );
            })}
        </div>
    );
}
