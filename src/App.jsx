import arrow from "./assets/icon-arrow.svg";
import { MapContainer, TileLayer } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import MarkerPosition from "./MarkerPosition";

export default function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const [timezone, setTimezone] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [tooLarge, setTooLarge] = useState(false);
  const checkIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        setAddress(data);

        let org = await data.org;
        org.length > 20 ? setTooLarge(true) : setTooLarge(false);

        console.log(tooLarge);
        let pretimezone = await data.utc_offset;
        let utc = pretimezone.substr(0, 3);

        setTimezone(utc);
      };
      getInitialData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function getEnteredAdrress() {
    if (checkIpAddress.test(ipAddress)) {
      const res = await fetch(`https://ipapi.co/${ipAddress}/json/`);
      const data = await res.json();
      setAddress(data);

      let org = await data.org;
      org.length > 20 ? setTooLarge(true) : setTooLarge(false);
      let pretimezone = await data.utc_offset;
      let utc = pretimezone.substr(0, 3);

      setTimezone(utc);
    } else {
      setInvalid(true);
    }
  }

  function handleSubmit(e) {
    setTooLarge(false)
    setInvalid(false);
    e.preventDefault();
    getEnteredAdrress();
  }

  return (
    <main className=" w-screen flex-col flex items-center justify-center ">
      <div className="bgMobile bgDesktop md:w-full bg-no-repeat bg-cover md:h-[280px] -z-10 h-[300px] w-full top-0 absolute"></div>
      <h1 className="text-[19px] md:text-[32px] text-white font-bold md:mt-[27px] mt-[31px] text-center">
        IP Address Tracker
      </h1>
      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="flex mt-[34px] flex-col md:mt-[23px]"
      >
        <div className="flex">
          <label
            htmlFor="IP"
            className="text-[14px] overflow-hidden rounded-l-2xl "
          >
            <input
              className={`h-[58px] text-[17px] rounded-l-2xl lg:text-[18px] bg-white ${
                invalid ? " border-2 border-red-400  " : ""
              } font-medium pl-[23px] w-[269px] md:w-[500px]`}
              type="text"
              required
              placeholder="Search for any IP address"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
            />
          </label>
          <button className="w-[58px] transition-all duration-200 ease-in-out hover:bg-[#3F3F3F] h-[58px] bg-black rounded-r-2xl flex items-center justify-center">
            <img src={arrow} className=" h-[15px] "></img>
          </button>
        </div>
        {invalid ? (
          <div className="text-center text-red-300 font-bold md:text-xl text-lg">
            Please enter a valid ip address
          </div>
        ) : null}
      </form>
      {address && (
        <>
          <div className="h-[294px] lg:w-[1110px] lg:h-[160px] lg:grid-cols-4 md:grid md:grid-cols-2 md:w-[500px] shadow-2xl md:mt-[48px] mt-[24px] rounded-2xl bg-white flex flex-col justify-evenly items-center w-[327px]">
            <div className="md:flex md:items-center lg:pl-[33px] lg:w-[278px] lg:border-r lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
              Country
              </p>
              <h3 className="mt-[5px]  lg:text-[27px] font-bold text-[19px]">
                {address.country_name}
              </h3>
            </div>
            <div className="md:flex md:items-center lg:pl-[33px] lg:w-[278px] lg:border-r lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
                Location
              </p>
              <h3 className="mt-[5px]  lg:text-[27px] font-bold text-[19px]">
                {address.city}
              </h3>
            </div>
            <div className="md:flex md:items-center lg:pl-[33px] lg:w-[278px] lg:border-r lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
                Timezone
              </p>
              <h3 className="mt-[5px]  lg:text-[27px] font-bold text-[19px]">
                UTC {timezone}
              </h3>
            </div>
            <div className="md:flex relative md:items-center lg:pl-[33px] lg:w-[278px] lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
                ISP
              </p>
              <h3
                className={`mt-[5px] ${
                  tooLarge
                    ? "lg:text-[19px] text-[14px]"
                    : "lg:text-[27px] text-[19px]"
                }  text-center  lg:text-start font-bold `}
              >
                {address.org}
              </h3>
            </div>
          </div>

          <MapContainer
            className="absolute top-[300px] lg:top-[280px] -z-20"
            center={[address.latitude, address.longitude]}
            style={{ height: "700px", width: "100vw" }}
            zoom={13}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MarkerPosition address={address}></MarkerPosition>
          </MapContainer>
        </>
      )}
    </main>
  );
}
