import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const formatDateToIndonesian = (dateString) => {
  return format(parseISO(dateString), "dd MMMM yyyy", {
    locale: id,
  });
};

export default formatDateToIndonesian;
