import { Popover, type PopoverProps } from "antd";
import React from "react";
import { type FC } from "~/utils/language/types";
import Button from "./Button";

interface ConfirmProps extends PopoverProps {
  onConfirm: () => void;
  onReject?: () => void;
  title?: string;
  loading?: boolean;
}
export default function ConfirmTooltip({
  children,
  onConfirm,
  onReject,
  title = "Estas seguro?",
  loading = false,
  ...props
}: FC<ConfirmProps>) {
  return (
    <Popover
      trigger="click"
      onOpenChange={onReject}
      // onClickOutside={props.onClickOutside ?? onReject}
      content={
        <div className="flex flex-col gap-4 p-1 font-custom">
          <span className="max-w-[14rem] text-base">{title}</span>
          <div className="flex gap-4">
            <Button
              size="px-1 py-1 text-xs"
              className="w-full"
              onClick={onReject}
              kind={Button.KINDS.danger}
            >
              No
            </Button>
            <Button
              size="px-1 py-1 text-xs"
              className="w-full"
              onClick={onConfirm}
              kind={Button.KINDS.secondary}
              loading={loading}
            >
              Si
            </Button>
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </Popover>
  );
}
