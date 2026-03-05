export default function ExerciseCard({ exercise }) {

  return (
    <div className="col-md-3">

      <div className="card shadow-sm border-0 h-100">

        <img
          src={exercise.gifUrl}
          className="card-img-top"
          alt={exercise.name}
        />

        <div className="card-body">

          <h6 className="fw-bold">
            {exercise.name}
          </h6>

          <p className="small text-muted mb-1">
            Músculo: {exercise.target}
          </p>

          <p className="small text-muted">
            Equipo: {exercise.equipment}
          </p>

        </div>

      </div>

    </div>
  );
}