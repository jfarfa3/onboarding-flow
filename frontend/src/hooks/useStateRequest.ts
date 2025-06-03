import { getStateRequests } from "@/services/stateRequest";
import useGeneralStore from "@/store/generalStore";
import useStateRequestStore from "@/store/stateRequest";
import { useEffect } from "react";

export function useStateRequest() {
  const {
    stateRequest,
    setStateRequest,
    setStateRequestOptions,
    stateRequestOptions,
  } = useStateRequestStore();
  const { reloadStateRequest, setReloadStateRequest } = useGeneralStore();

  useEffect(() => {
    async function loadStateRequest() {
      try {
        if (!reloadStateRequest && stateRequest.length > 0) {
          const options = stateRequest.map((stateRequest) => ({
            label: stateRequest.label,
            value: stateRequest.id,
          }));
          setStateRequestOptions(options);
          return;
        }

        const fetchStateRequests = await getStateRequests();
        setStateRequest(fetchStateRequests);
        setReloadStateRequest(false);
        const options: Record<string, string>[] = fetchStateRequests.map(
          (stateRequest) => ({
            label: stateRequest.label,
            value: stateRequest.id,
          })
        );
        setStateRequestOptions(options);
      } catch {
        /* empty */
      }
    }
    loadStateRequest();
  }, [setStateRequest]);

  return { stateRequestOptions, stateRequest };
}
