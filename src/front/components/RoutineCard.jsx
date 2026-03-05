import React from "react";

const RoutineCard = ({ routine, onView }) => {
  return (
    <div className="col-sm-6 col-md-4 col-lg-3">
      <div className="card routine-card h-100">

        <div className="card-body d-flex flex-column">

          <h5 className="fw-bold">
            {routine.title}
          </h5>

          <p className="text-muted small flex-grow-1">
            {routine.description}
          </p>

          <div className="mb-2 small">
            <span className="badge bg-secondary">
              {routine.difficulty || "General"}
            </span>
          </div>

          <div className="mb-3 small text-muted">
            {routine.style || "Workout"}
          </div>

          <button
            className="btn btn-dark mt-auto"
            onClick={() => onView(routine)}
          >
            Ver rutina
          </button>

        </div>

      </div>
    </div>
  );
};

export default RoutineCard;