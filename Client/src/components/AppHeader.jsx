function AppHeader() {
  return (
    <header className="grid min-h-[250px] place-items-center px-5 pt-12 pb-8 text-center max-md:min-h-[220px] max-md:pt-9">
      <div>
        <div className="mx-auto mb-3 grid h-[42px] w-[42px] place-items-center rounded-full border border-sky-300/40 bg-white/10 text-sm font-extrabold text-sky-100 shadow-sm">
          EDU
        </div>
        <h1 className="m-0 text-[clamp(32px,5vw,52px)] leading-tight font-black tracking-normal text-white">
          Tra cứu điểm thi
        </h1>
        <p className="mt-4 text-lg font-semibold text-sky-100/80 max-md:text-base">
          Nhập SBD để xem được kết quả thi của bạn.
        </p>
      </div>
    </header>
  )
}

export default AppHeader
