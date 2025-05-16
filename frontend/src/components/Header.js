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
        <NavbarMenuItem key="nav-1">
          <Link className="w-full" href="/" color="foreground">
            首页
          </Link>
        </NavbarMenuItem>
        <NavbarMenuItem key="nav-10">
          <Link className="w-full" href="/history" color="foreground">
            我的创作
          </Link>
        </NavbarMenuItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-md"
                endContent={<PiCaretDown />}
                variant="light"
              >
                长文本创作
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="features" variant="flat">
            <DropdownItem
              key="autoscaling"
              description=""
              startContent={<PiFileText color="#db2777" size="20" />}
            >
              <Link className="w-full" href="/story" color="foreground">
                故事生成
              </Link>
            </DropdownItem>
            <DropdownItem
              key="autoscaling"
              description=""
              startContent={<PiFiles color="#db2777" size="20" />}
            >
              <Link className="w-full" href="/report" color="foreground">
                报告生成
              </Link>
            </DropdownItem>
            <DropdownItem
              key="autoscaling"
              description=""
              startContent={<PiFilmReel color="#db2777" size="20" />}
            >
              <Link className="w-full" href="/story" color="foreground">
                剧本生成
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* <NavbarMenuItem key="nav-12">
          <Link
            href="https://arxiv.org/abs/2503.08275"
            target="_blank"
            rel="noopener"
            color="foreground"
          >
            参考论文
          </Link>
        </NavbarMenuItem> */}
        <NavbarMenuItem className="hidden lg:flex ml-16 mr-16">
          <Link href="#" color="foreground">
            登录
          </Link>
          <Link href="#" color="foreground" className="ml-4">
            注册账号
          </Link>
        </NavbarMenuItem>
        <Dropdown>
          <NavbarItem>
            <DropdownTrigger>
              <Button
                disableRipple
                className="p-0 bg-transparent data-[hover=true]:bg-transparent text-md"
                startContent={<PiGear size={18} />}
                variant="light"
              >
                设置
              </Button>
            </DropdownTrigger>
          </NavbarItem>
          <DropdownMenu aria-label="features" variant="flat">
            <DropdownItem key="autoscaling" description="">
              <Link
                className="w-full"
                href="/settings/model"
                color="foreground"
              >
                模型服务
              </Link>
            </DropdownItem>
            <DropdownItem key="autoscaling" description="">
              <Link
                className="w-full"
                href="/settings/search"
                color="foreground"
              >
                搜索服务
              </Link>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
            href="/"
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
