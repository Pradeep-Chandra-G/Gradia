import React from "react";

type GlobalSettingsProps = {
  icon: React.ElementType;
  title: string;
};

function GlobalSettings({ icon: Icon, title }: GlobalSettingsProps) {
  return (
    <div className="w-full bg-foreground rounded-lg p-8 hover:cursor-pointer active:bg-foreground/90 select-none border border-white/10">
      {/* ICON */}
      <div className="flex flex-col items-center justify-center gap-2">
        <Icon className="size-12" />
        <h1 className="tracking-wide">{title}</h1>
      </div>
    </div>
  );
}

export default GlobalSettings;
