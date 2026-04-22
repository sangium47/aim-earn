import type { InputProps } from "@/components/type";

export function Input(props: InputProps) {
  if (props.multiline) {
    const {
      multiline: _multiline,
      leading,
      trailing,
      wrapperClassName = "",
      className = "",
      ...rest
    } = props;
    void _multiline;
    return (
      <div
        className={[
          "inline-flex w-full items-start gap-2 rounded-lg border border-line px-3 py-2.5 text-sm text-ink transition-colors focus-within:border-ink-secondary",
          rest.disabled ? "bg-line/40" : "bg-white",
          wrapperClassName,
        ].join(" ")}
      >
        {leading ? (
          <span className="flex shrink-0 items-center pt-0.5 text-ink-tertiary">
            {leading}
          </span>
        ) : null}
        <textarea
          className={[
            "min-h-[96px] w-full flex-1 resize-y bg-transparent outline-none placeholder:text-ink-tertiary",
            className,
          ].join(" ")}
          {...rest}
        />
        {trailing ? (
          <span className="flex shrink-0 items-center pt-0.5 text-ink-tertiary">
            {trailing}
          </span>
        ) : null}
      </div>
    );
  }

  const {
    multiline: _multiline,
    leading,
    trailing,
    wrapperClassName = "",
    className = "",
    ...rest
  } = props;
  void _multiline;
  return (
    <div
      className={[
        "inline-flex h-10 w-full items-center gap-2 rounded-lg border border-line px-3 text-sm text-ink transition-colors focus-within:border-ink-secondary",
        rest.disabled ? "bg-line/40" : "bg-white",
        wrapperClassName,
      ].join(" ")}
    >
      {leading ? (
        <span className="flex shrink-0 items-center text-ink-tertiary">
          {leading}
        </span>
      ) : null}
      <input
        className={[
          "h-full w-full flex-1 bg-transparent outline-none placeholder:text-ink-tertiary",
          className,
        ].join(" ")}
        {...rest}
        onWheel={(e) => {
          // Prevent accidental value changes on number inputs from the scroll wheel.
          if (e.currentTarget.type === "number") e.currentTarget.blur();
          rest.onWheel?.(e);
        }}
      />
      {trailing ? (
        <span className="flex shrink-0 items-center text-ink-tertiary">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}
