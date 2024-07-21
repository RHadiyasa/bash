import React, { useState, useEffect } from "react";
import Select from "react-select";
import useProvincesData from "@/hooks/useProvincesData";
import customStyles from "@/app/transactions/new-transaction/_components/formStyle";

const LocationSelect = ({ user, setUser }) => {
  const { provinces, getRegencies, getDistricts, getVillages } =
    useProvincesData();

  const [regencies, setRegencies] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [villages, setVillages] = useState([]);
  const [inputIds, setInputIds] = useState({});

  useEffect(() => {
    setInputIds({
      province: `react-select-province-${Math.random()}`,
      regency: `react-select-regency-${Math.random()}`,
      district: `react-select-district-${Math.random()}`,
      village: `react-select-village-${Math.random()}`,
    });
  }, []);

  const handleLocationChange = (selectedOption, { name }) => {
    setUser((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        [name]: selectedOption ? selectedOption.label : "",
      },
    }));

    if (name === "province") {
      const selectedProvince = provinces.find(
        (province) => province.value === selectedOption?.value
      );
      setRegencies(
        selectedProvince ? getRegencies(selectedProvince.value) : []
      );
      setDistricts([]);
      setVillages([]);
    } else if (name === "regency") {
      setDistricts(getDistricts(selectedOption?.value));
      setVillages([]);
    } else if (name === "district") {
      setVillages(getVillages(selectedOption?.value));
    }
  };

  const handleVillageChange = (selectedOption) => {
    setUser((prevState) => ({
      ...prevState,
      location: {
        ...prevState.location,
        village: selectedOption ? selectedOption.label : "",
      },
    }));
  };

  return (
    <div className="grid gap-3">
      <div className="grid gap-2">
        <p className="text-sm font-bold font-sans ml-1">Provinsi</p>
        <Select
          name="province"
          options={provinces}
          onChange={(option, actionMeta) =>
            handleLocationChange(option, actionMeta)
          }
          placeholder="Pilih Provinsi"
          styles={customStyles}
          value={
            provinces.find(
              (province) => province.label === user.location.province
            ) || null
          }
          inputId={inputIds.province}
        />
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-bold font-sans ml-1">Kabupaten/Kota</p>
        <Select
          name="regency"
          options={regencies}
          onChange={(option, actionMeta) =>
            handleLocationChange(option, actionMeta)
          }
          placeholder="Pilih Kabupaten/Kota"
          isDisabled={!user.location.province}
          styles={customStyles}
          value={
            regencies.find(
              (regency) => regency.label === user.location.regency
            ) || null
          }
          inputId={inputIds.regency}
        />
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-bold font-sans ml-1">Kecamatan</p>
        <Select
          name="district"
          options={districts}
          onChange={(option, actionMeta) =>
            handleLocationChange(option, actionMeta)
          }
          placeholder="Pilih Kecamatan"
          isDisabled={!user.location.regency}
          styles={customStyles}
          value={
            districts.find(
              (district) => district.label === user.location.district
            ) || null
          }
          inputId={inputIds.district}
        />
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-bold font-sans ml-1">Kelurahan</p>
        <Select
          name="village"
          options={villages}
          onChange={handleVillageChange}
          placeholder="Pilih Kelurahan"
          isDisabled={!user.location.district}
          styles={customStyles}
          value={
            villages.find(
              (village) => village.label === user.location.village
            ) || null
          }
          inputId={inputIds.village}
        />
      </div>
    </div>
  );
};

export default LocationSelect;
