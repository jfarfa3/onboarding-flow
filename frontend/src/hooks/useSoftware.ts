import { getAllSoftwareRequests } from "@/services/software";
import useGeneralStore from "@/store/generalStore";
import useSoftwareStore from "@/store/softwareStore";
import { useEffect } from "react";

export function useSoftwareRequest() {
  const { software, softwareOptions, setSoftware, setSoftwareOptions } =
    useSoftwareStore();
  const { reloadSoftware, setReloadSoftware } = useGeneralStore();

  useEffect(() => {
    const fetchSoftware = async () => {
      try {
        if (!reloadSoftware && software.length > 0) {
          const options = software.map((software) => ({
            label: software.name,
            value: software.id || "",
          }));
          setSoftwareOptions(options);
          return;
        }
        const softwareList = await getAllSoftwareRequests();
        setSoftware(softwareList);
        setReloadSoftware(false);
        const options = softwareList.map((software) => ({
          label: software.name,
          value: software.id || "",
        }));
        setSoftwareOptions(options);
      } catch {
        /* empty */
      }
    };
    fetchSoftware();
  }, [setSoftware, setSoftwareOptions]);

  return {
    software,
    softwareOptions,
    setSoftware,
  };
}
