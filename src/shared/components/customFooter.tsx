import { Divider } from '@heroui/divider';
import { ContactPhone } from './icon/phone';
import { InstagramIcon } from './icon/instagram';
import { EmailIcon } from './icon/emailIcon';

const CustomFooter = () => {
  return (
    <footer className="text-foreground py-6 mt-10">
      <Divider />
      <div className="text-center py-12">
        <span className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
          Swantara&nbsp;
        </span>
      </div>
      <div className="flex items-center justify-center mx-10">
        <div className="text-2xl w-1/2 text-center font-bold">Rakyat Bantu Rakyat</div>
        <div className="flex items-start justify-around w-full font-semibold">
          <div className="w-1/2">
            <p>Office Address</p>
            <p className="text-xs font-normal">
              Pondok Indah Office Tower 2, 15th Floor Jl. Sultan Iskandar Muda Kav. <br />
              V-TA, Pondok Indah, Kec. Kby. Lama, Kota Jakarta Selatan, <br />
              Daerah Khusus Ibukota Jakarta, 12310
            </p>
            <div className="text-sm mt-2 flex items-center gap-2">
              <ContactPhone />
              <p>089693919042</p>
            </div>
          </div>
          <div className="w-1/2">
          <div>Social Media</div>
            <div className="text-sm mt-2 flex items-center gap-2">
              <InstagramIcon />
              <p>swantara.id</p>
            </div>
            <div className="text-sm mt-2 flex items-center gap-2">
              <EmailIcon />
              <p>support@swantara.id</p>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs font-semibold text-center mt-10">Copyright &copy; {new Date().getFullYear()} Swantara Indonesia. All rights reserved.</p>
    </footer>
  );
};

export default CustomFooter;
