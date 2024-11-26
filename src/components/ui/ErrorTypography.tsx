const ErrorTypography = ({ errorMessage = 'Oops... error occurred!' }) => {
  return (
    <div className="flex">
      <p className="font-bold text-error">{errorMessage}</p>
    </div>
  )
}

export default ErrorTypography
