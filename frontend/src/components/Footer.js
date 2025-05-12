import React from "react";
import { Container } from "@mui/material";
import {
  PiChecksDuotone,
  PiSpinnerGapDuotone,
  PiTornadoDuotone,
} from "react-icons/pi";

const Footer = () => {
  return (
    <div className="py-4 border-t border-gray-light ">
      <div className="mx-6 text-sm">
        <div className="flex items-center mb-2">
          <div className="flex items-center font-bold ">
            <PiTornadoDuotone size={20} className="mr-2" />
            HyperGen
          </div>
        </div>
        <div className="mb-4">
          一种通过递归任务分解实现类人自适应写作的长篇写作通用智能体框架
        </div>
        <div className="text-default-600">
          © {new Date().getFullYear()} HyperGen
        </div>
      </div>
    </div>
  );
};

export default Footer;
