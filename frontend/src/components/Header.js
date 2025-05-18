import React, { useState } from "react";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";

import {
  PiFileText,
  PiFiles,
  PiFilmReel,
  PiCaretDown,
  PiGear,
  PiGithubLogo,
} from "react-icons/pi";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const Logo = () => {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      viewBox="0 0 256 256"
      height="28"
      width="28"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="linearGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop
            offset="0%"
            style={{ "stop-color": "#db2777", "stop-opacity": "1" }}
          />
          <stop
            offset="100%"
            style={{ "stop-color": "#fcd34d", "stop-opacity": "1" }}
          />
        </linearGradient>
      </defs>

      <path
        fill="url(#linearGradient)"
        d="M216,40V216a16,16,0,0,1-16,16H56a16,16,0,0,1-16-16V40A16,16,0,0,1,56,24H200A16,16,0,0,1,216,40Z"
        opacity="0.2"
      ></path>

      <path
        fill="url(#linearGradient)"
        d="M144,228a12,12,0,0,1-12,12H116a12,12,0,0,1,0-24h16A12,12,0,0,1,144,228ZM220,32H60a12,12,0,0,0,0,24,12,12,0,0,1,0,24H44a12,12,0,0,0,0,24H76a12,12,0,0,1,0,24,12,12,0,0,0,0,24h48a12,12,0,0,1,0,24,12,12,0,0,0,0,24h48a12,12,0,0,0,0-24,12,12,0,0,1,0-24h16a12,12,0,0,0,0-24H164a12,12,0,0,1,0-24,12,12,0,0,0,0-24,12,12,0,0,1,0-24h56a12,12,0,0,0,0-24Z"
      ></path>
    </svg>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  function getMenuItems() {
    return (
      <>
        <NavbarMenuItem key="nav-12">
          <Link
            href="https://arxiv.org/abs/2503.08275"
            target="_blank"
            rel="noopener"
            color="foreground"
          >
            参考论文
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="nav-12">
          <Link
            href="https://zhiyu.github.io/hypergen/"
            target="_blank"
            rel="noopener"
            color="foreground"
          >
            <Button
              disableRipple
              className="p-0 bg-transparent data-[hover=true]:bg-transparent text-md"
              startContent={<PiGithubLogo size={18} />}
              variant="light"
            >
              Github
            </Button>
          </Link>
        </NavbarMenuItem>

        <NavbarMenuItem key="nav-0">
          <ThemeSwitcher />
        </NavbarMenuItem>
      </>
    );
  }

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      isBordered
      classNames={{
        base: "border-b border-gray-light ",
        wrapper: "w-full px-0 mx-6 max-w-[5120px]",
      }}
    >
      <NavbarContent justify="end">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand>
          <Link
            className="w-full flex items-center"
            href="https://zhiyu.github.io/hypergen/"
            color="foreground"
          >
            <Logo />
            <span className="font-bold ml-2">
              Hyper<span>Gen</span>
            </span>
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarMenu>{getMenuItems()}</NavbarMenu>

      <NavbarContent
        className="hidden sm:flex gap-8 font-medium"
        justify="center"
      >
        {getMenuItems()}
      </NavbarContent>
    </Navbar>
  );
};

export default Header;
