import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const formatDateToIndonesian = (dateString) => {
  if (!dateString) {
    return "Invalid date"; // Anda dapat mengubah pesan ini sesuai kebutuhan
  }

  try {
    return format(parseISO(dateString), "dd MMMM yyyy - HH:mm", {
      locale: id,
    });
  } catch (error) {
    console.error("Error parsing date:", error);
    return "Invalid date"; // Anda dapat mengubah pesan ini sesuai kebutuhan
  }
};

export default formatDateToIndonesian;
