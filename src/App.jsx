import arrow from "./assets/icon-arrow.svg";
import { MapContainer, TileLayer } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import MarkerPosition from "./MarkerPosition";

export default function App() {
  const [address, setAddress] = useState(null);
  const [ipAddress, setIpAddress] = useState("");
  const checkIpAddress = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/;
  const checkDomain =
    /^(?!-)[A-Za-z0-9-]+([\-\.]{1}[a-z0-9]+)*\.[A-Za-z]{2,6}$/;

  useEffect(() => {
    try {
      const getInitialData = async () => {
        const res = await fetch(
          `https://geo.ipify.org/api/v2/country,city?apiKey=${
            import.meta.env.VITE_REACT_APP_API_KEY
          }&ipAddress=192.222.174.121`
        );
        const data = await res.json();
        setAddress(data);
        console.log(data);
      };
      getInitialData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  async function getEnteredAdrress() {
    const res = await fetch(
      `https://geo.ipify.org/api/v2/country,city?apiKey=${
        import.meta.env.VITE_REACT_APP_API_KEY
      }&${
        checkIpAddress.test(ipAddress)
          ? `ipAddress=${ipAddress}`
          : checkDomain.test(ipAddress)
          ? `domain=${ipAddress}`
          : ""
      }`
    );
    const data = await res.json();
    setAddress(data);
  }
  function handleSubmit(e) {
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
        className="flex mt-[34px] md:mt-[23px]"
      >
        <label
          htmlFor="IP"
          className="rounded-l-2xl overflow-hidden text-[14px] bg-white"
        >
          <input
            className="h-[58px] text-[17px] lg:text-[18px] font-medium pl-[23px] w-[269px] md:w-[500px]"
            type="text"
            required
            placeholder="Search for any IP address or domain"
            value={ipAddress}
            onChange={(e) => setIpAddress(e.target.value)}
          />
        </label>
        <button className="w-[58px] transition-all duration-200 ease-in-out hover:bg-[#3F3F3F] h-[58px] bg-black rounded-r-2xl flex items-center justify-center">
          <img src={arrow} className=" h-[15px] "></img>
        </button>
      </form>
      {address && (
        <>
          <div className="h-[294px] lg:w-[1110px] lg:h-[160px] lg:grid-cols-4 md:grid md:grid-cols-2 md:w-[500px] shadow-2xl md:mt-[48px] mt-[24px] rounded-2xl bg-white flex flex-col justify-evenly items-center w-[327px]">
            <div className="md:flex md:items-center lg:pl-[33px] lg:w-[278px] lg:border-r lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
                IP Address
              </p>
              <h3 className="mt-[5px]  lg:text-[27px] font-bold text-[19px]">
                {address.ip}
              </h3>
            </div>
            <div className="md:flex md:items-center lg:pl-[33px] lg:w-[278px] lg:border-r lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
                Location
              </p>
              <h3 className="mt-[5px]  lg:text-[27px] font-bold text-[19px]">
                {address.location.region}
              </h3>
            </div>
            <div className="md:flex md:items-center lg:pl-[33px] lg:w-[278px] lg:border-r lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
                Timezone
              </p>
              <h3 className="mt-[5px]  lg:text-[27px] font-bold text-[19px]">
                UTC{address.location.timezone}
              </h3>
            </div>
            <div className="md:flex md:items-center lg:pl-[33px] lg:w-[278px] lg:h-[80px] lg:items-start lg:justify-start md:justify-center md:flex-col">
              <p className="text-center text-[#949494] lg:text-[11px] text-[10px] tracking-wider font-bold uppercase ">
                ISP
              </p>
              <h3 className="mt-[5px]  lg:text-[27px] font-bold text-[19px]">
                {address.isp}
              </h3>
            </div>
          </div>

            <MapContainer
              className="absolute top-[300px] lg:top-[280px] -z-20"
              center={[address.location.lat, address.location.lng]}
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
