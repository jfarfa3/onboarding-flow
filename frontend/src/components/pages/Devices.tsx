import Div from "../atoms/Div";
import Devicetable from "../organism/DevicesTable";

export default function Devices() {
  return (
    <Div>
      <div className="p-4 text-black">
        <Devicetable />
      </div>
    </Div>
  );
}