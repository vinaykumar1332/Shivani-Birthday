import { motion } from "framer-motion";
import "./BoardingPass.css";

// A playful boarding pass to her dream city, with a little plane that keeps
// flying the route on loop.
export function BoardingPass({ pass }) {
  return (
    <motion.div
      className="boarding-pass"
      initial={{ opacity: 0, y: 50, rotate: -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ type: "spring", stiffness: 70, damping: 15 }}
    >
      <div className="boarding-pass__main">
        <div className="boarding-pass__top">
          <span className="boarding-pass__label">Boarding Pass</span>
          <span className="boarding-pass__airline">Dream Airways</span>
        </div>

        <div className="boarding-pass__route">
          <div>
            <strong>{pass.from}</strong>
            <span>{pass.fromCity}</span>
          </div>
          <div className="boarding-pass__path" aria-hidden="true">
            <span className="boarding-pass__plane">✈</span>
          </div>
          <div className="boarding-pass__dest">
            <strong>{pass.to}</strong>
            <span>{pass.toCity}</span>
          </div>
        </div>

        <dl className="boarding-pass__fields">
          <div>
            <dt>Passenger</dt>
            <dd>{pass.passenger}</dd>
          </div>
          <div>
            <dt>Flight</dt>
            <dd>{pass.flight}</dd>
          </div>
          <div>
            <dt>Seat</dt>
            <dd>{pass.seat}</dd>
          </div>
          <div>
            <dt>Gate</dt>
            <dd>{pass.gate}</dd>
          </div>
          <div>
            <dt>Boarding</dt>
            <dd>{pass.boarding}</dd>
          </div>
        </dl>
      </div>

      <div className="boarding-pass__stub" aria-hidden="true">
        <span className="boarding-pass__stub-seat">{pass.seat.split(" ")[0]}</span>
        <span className="boarding-pass__barcode" />
      </div>
    </motion.div>
  );
}
