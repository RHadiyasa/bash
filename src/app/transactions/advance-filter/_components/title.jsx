import React from "react";

const Title = ({title}) => {
  return (
    <div className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {title}
    </div>
  );
};

export default Title;
