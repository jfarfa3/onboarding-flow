// import { getAllDevicesRequests } from "@/services/devices";
// import useDevicesStore from "@/store/devicesStore";
// import useGeneralStore from "@/store/generalStore";
// import { useEffect } from "react";

// export function useDevicesRequest() {
//   const { devices, setDevices } = useDevicesStore();
//   const { reloadDevices, setReloadDevices } = useGeneralStore();


//   useEffect(() => {
//     async function loadDevices() {
//       try {
//         if (!reloadDevices && devices.length > 0) {
//           return;
//         }

//         const fetchedDevices = await getAllDevicesRequests();
//         setReloadDevices(false);
//         setDevices(fetchedDevices);
//       } catch { /* empty */ }
//     }
//     loadDevices();
//   }, [setDevices, setReloadDevices]);
//   return {
//     devices,
//     setDevices,
//   };
// }