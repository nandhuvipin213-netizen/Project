interface DeliveryProgressProps {
  status: string;
}

const stages = [
  { label: "Assigned", value: "assigned" },
  { label: "Picked Up", value: "picked-up" },
  { label: "In Transit", value: "in-transit" },
  { label: "Delivered", value: "delivered" },
];

const DeliveryProgress = ({ status }: DeliveryProgressProps) => {
  const currentIndex = stages.findIndex(
    (stage) => stage.value === status
  );

  return (
    <div className="mt-5 rounded-xl border border-slate-100 bg-slate-50 p-3 sm:p-4">
      <h3 className="mb-4 font-bold text-slate-800 sm:mb-5">
        Delivery Progress
      </h3>

      <div className="flex items-start">
        {stages.map((stage, index) => {
          const completed = index <= currentIndex;
          const current = index === currentIndex;

          return (
            <div
              key={stage.value}
              className="flex min-w-0 flex-1 flex-col items-center"
            >
              <div className="flex w-full items-center">
                {index > 0 && (
                  <div
                    className={`h-1 flex-1 ${
                      index <= currentIndex
                        ? "bg-violet-600"
                        : "bg-slate-200"
                    }`}
                  />
                )}

                <div
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold sm:h-8 sm:w-8 ${
                    completed
                      ? "bg-violet-600 text-white"
                      : "bg-slate-200 text-slate-500"
                  } ${current ? "ring-4 ring-violet-100" : ""}`}
                >
                  {index + 1}
                </div>

                {index < stages.length - 1 && (
                  <div
                    className={`h-1 flex-1 ${
                      index < currentIndex
                        ? "bg-violet-600"
                        : "bg-slate-200"
                    }`}
                  />
                )}
              </div>

              <p className="mt-2 w-full px-0.5 text-center text-[10px] font-semibold leading-tight text-slate-600 sm:mt-3 sm:text-xs">
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeliveryProgress;