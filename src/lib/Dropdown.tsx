import { Menu, Transition } from "@headlessui/react";
import React from "react";
import { cn } from "~/utils/styles";
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import { type FC } from "~/utils/types";

const DropdownItem = ({
  as = "div",
  ...props
}: Parameters<typeof Menu.Item>[0]) => {
  return <Menu.Item as={as} {...props} />;
};

type DropdownProps = {
  label: string;
};
const Dropdown = ({ children, className, label }: FC<DropdownProps>) => {
  return (
    <Menu as="div">
      <Menu.Button className={cn(className, "no-ring  no-underline")}>
        {({ open }) => {
          return (
            <div
              className={
                "flex w-full items-center justify-center transition-colors duration-300"
              }
            >
              {label}
              <ChevronDownIcon
                className="ml-2 -mr-1 h-5 w-5"
                style={{
                  transform: open ? "rotate(180deg)" : "rotate(0deg)",
                }}
              />
            </div>
          );
        }}
      </Menu.Button>

      <Transition
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-max divide-y divide-gray-100 rounded-md bg-white px-10 py-8 font-medium text-gray-500 shadow-lg">
          {children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
// Menu.Item.as = "div"
// Menu.Item.arguments
Dropdown.Item = DropdownItem;
export default Dropdown;
