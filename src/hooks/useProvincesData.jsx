import provinceData from "../lib/province/json/provinces.json";
import regencyData from "../lib/province/json/regencies.json";
import districtData from "../lib/province/json/districts.json";
import villageData from "../lib/province/json/villages.json";

const useProvincesData = () => {
  const provinces = provinceData.map((province) => ({
    value: province.province_id,
    label: province.province_name,
  }));

  const getRegencies = (provinceId) => {
    return regencyData
      .filter((regency) => regency.province_id === provinceId)
      .map((regency) => ({
        value: regency.regency_id,
        label: regency.regency_name,
      }));
  };

  const getDistricts = (regencyId) => {
    return districtData
      .filter((district) => district.regency_id === regencyId)
      .map((district) => ({
        value: district.district_id,
        label: district.district_name,
      }));
  };

  const getVillages = (districtId) => {
    return villageData
      .filter((village) => village.district_id === districtId)
      .map((village) => ({
        value: village.village_id,
        label: village.village_name,
      }));
  };

  return { provinces, getRegencies, getDistricts, getVillages };
};

export default useProvincesData;
