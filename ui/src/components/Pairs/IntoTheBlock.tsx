import React, { useEffect, useState } from "react";

declare const window: any;

function IntoTheBlock({ pairAddress }) {
  const [notSupported, setNotSupported] = useState(false);
  useEffect(() => {
    console.log(window?.itbWidgetInit, pairAddress)
    if (window?.itbWidgetInit) {
      window?.itbWidgetInit({
        apiKey: "IXlsoP7uCH5tjojovmac53V8xlOh8Qa31yOgozMG",
        options: {
          colors: {
            series: ["#FF1744"],
          },
          protocol: "sushiswap",
          pairAddress,
          granularity: "hourly",
          loader: true,
          hideNavigator: true,
          events: {
            onPairNotSupported: () => {
              setNotSupported(true);
            },
          },
        },
      });
    }
  }, [pairAddress]);

  return !notSupported ? (
    <div>
      <h2>
        IntoTheBlock
      </h2>
      <div className="widget-container">
        <div className="charts-container">
          <div
            data-target="itb-widget"
            data-type="protocol-roi-calculator"
            className="full-width"
          ></div>
          <div
            data-target="itb-widget"
            data-type="protocol-fees-per-liquidity"
          ></div>
          <div
            data-target="itb-widget"
            data-type="protocol-transactions-breakdown"
          ></div>
          <div
            data-target="itb-widget"
            data-type="protocol-liquidity-variation"
            data-options='{ "pairTokenIndex": 0 }'
          ></div>
          <div
            data-target="itb-widget"
            data-type="protocol-liquidity-variation"
            data-options='{ "pairTokenIndex": 1 }'
          ></div>
        </div>
        <div className="footer">
          <div data-target="itb-widget" data-type="call-to-action"></div>
          <div data-target="itb-widget" data-type="powered-by"></div>
        </div>
      </div>
    </div>
  ) : null;
}

export default IntoTheBlock;
