import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const SelectTrash = ({ trashes, onSelect }) => {
  const [searchTrash, setSearchTrash] = useState("");
  const [filteredTrash, setFilteredTrash] = useState([]);
  const [selectedTrash, setSeletedTrash] = useState("");

  console.log(trashes);

  useEffect(() => {
    if (searchTrash) {
      setFilteredTrash(
        trashes.trashes.filter((trash) =>
          trash.trashName.toLowerCase().includes(searchTrash.toLowerCase())
        )
      );
    } else {
      setFilteredTrash(trashes.trashes);
    }
  }, [searchTrash, trashes]);

  const handleSelectedTrash = (value) => {
    setSeletedTrash(value);
    onSelect(value);
  };

  return (
    <Select value={selectedTrash} onValueChange={handleSelectedTrash}>
      <SelectTrigger>
        <SelectValue placeholder="Pilih Sampah" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <div className="flex items-center gap-2 p-2">
            <Input
              value={searchTrash}
              placeholder="Cari sampah..."
              onChange={(e) => setSearchTrash(e.target.value)}
              className="h-10 pl-9"
            />
            <Search className="absolute left-6 opacity-50" size={15} />
          </div>

          {Array.isArray(filteredTrash) && filteredTrash.length > 0 ? (
            filteredTrash.map((trash) => (
              <SelectItem key={trash._id} value={trash._id}>
                {trash.trashName}
              </SelectItem>
            ))
          ) : (
            <SelectItem disabled>Not found</SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectTrash;
