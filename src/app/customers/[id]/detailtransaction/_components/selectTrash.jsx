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
import React, { useEffect, useState } from "react";

const SelectTrash = ({ trashes, onSelect }) => {
  const [searchTrash, setSearchTrash] = useState("");
  const [filteredTrash, setFilteredTrash] = useState([]);
  const [selectedTrash, setSeletedTrash] = useState("");

  useEffect(() => {
    if (searchTrash) {
      setFilteredTrash(
        trashes.trashes?.filter((trash) =>
          trash.trashName
            .toLowerCase()
            .includes(searchTrash.toLowerCase())
        )
      );
    } else {
      setFilteredTrash(trashes.trashes || []);
    }
  }, [searchTrash, trashes]);

  const handleSelectedTrash = (value) => {
    setSeletedTrash(value);
    onSelect(value);
  };

  return (
    <Select value={selectedTrash} onValueChange={handleSelectedTrash}>
      <SelectTrigger className="glass-input h-11">
        <SelectValue placeholder="Pilih Sampah" />
      </SelectTrigger>
      <SelectContent className="glass-card">
        <SelectGroup>
          <div className="relative flex items-center gap-2 p-2">
            <Search className="absolute left-5 opacity-50" size={15} />
            <Input
              value={searchTrash}
              placeholder="Cari sampah..."
              onChange={(e) => setSearchTrash(e.target.value)}
              className="glass-input h-10 pl-9"
            />
          </div>

          {Array.isArray(filteredTrash) && filteredTrash.length > 0 ? (
            filteredTrash.map((trash) => (
              <SelectItem key={trash._id} value={trash._id}>
                {trash.trashName}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="not-found" disabled>Not found</SelectItem>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default SelectTrash;
