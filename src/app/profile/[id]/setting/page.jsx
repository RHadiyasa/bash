import { redirect } from "next/navigation";

const SettingRedirectPage = ({ params }) => {
  redirect(`/profile/${params.id}/details?tab=konfigurasi`);
};

export default SettingRedirectPage;
