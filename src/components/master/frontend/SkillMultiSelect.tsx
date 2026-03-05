"use client";

import Select from "react-select";

interface SkillOption {
  value: number;
  label: string;
}

export default function SkillMultiSelect({
  skills,
  onChange,
}: {
  skills: { id: number; name: string }[];
  onChange: (skills: string[]) => void;
}) {
  const options: SkillOption[] =
    skills?.map((skill) => ({
      value: skill.id,
      label: skill.name,
    })) || [];

  return (
    <div className="w-64">
      <Select
        isMulti
        options={options}
        placeholder="Search skills..."
        className="text-sm"
        onChange={(selected) =>
          onChange(selected.map((s: any) => s.value))
        }
      />
    </div>
  );
}