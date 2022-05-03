<template>
<nav id="main-nav" class="outline-card navbar navbar-expand-lg navbar-light container mt-5 mb-5 rounded">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Numerical</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" aria-current="page" href="#">History</a>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
            Calculators
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li>
              <a class="dropdown-item dropdown-toggle" href="#">
                Nonlinear Equations
              </a>
              <ul class="dropdown-menu dropdown-submenu">
                <li><a class="dropdown-item" href="#">Bisection Method</a></li>
                <li><a class="dropdown-item" href="#">False Position Method</a></li>
                <li><a class="dropdown-item" href="#">Newton Raphson Method</a></li>
                <li><a class="dropdown-item" href="#">Secant Method</a></li>
                <li><a class="dropdown-item" href="#">MOSS</a></li>
                <li><a class="dropdown-item" href="#">Muller's Method</a></li>
              </ul>
            </li>
            <li>
              <a class="dropdown-item dropdown-toggle" href="#">
                Systems of Linear Equations
              </a>
              <ul class="dropdown-menu dropdown-submenu">
                <li><a class="dropdown-item" href="#">Gauss-Jacobi Method</a></li>
                <li><a class="dropdown-item" href="#">Gauss-Seidel Method</a></li>
              </ul>
            </li>
            <li>
              <a class="dropdown-item dropdown-toggle" href="#">
                Interpolating Polynomials
              </a>
              <ul class="dropdown-menu dropdown-submenu">
                <li><a class="dropdown-item" href="#">Method of Undetermined Coefficients</a></li>
                <li><a class="dropdown-item" href="#">Euler Form</a></li>
              </ul>
            </li>
            <li>
              <a class="dropdown-item dropdown-toggle" href="#">
                Numerical Integration
              </a>
              <ul class="dropdown-menu dropdown-submenu">
                <li><a class="dropdown-item" href="#">Riemann Sum</a></li>
                <li><a class="dropdown-item" href="#">Trapezoidal Rule</a></li>
                <li><a class="dropdown-item" href="#">Simpson's 1/3 Rule</a></li>
                <li><a class="dropdown-item" href="#">Simpson's 3/8 Rule</a></li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
      <form class="d-flex">
        <input class="form-control me-2" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
</template>

<script>
export default {
  name: 'MainNav'
}
</script>

<style scoped>
#main-nav {
  padding: 10px 30px 10px 30px;
}

.dropdown-menu li {
  position: relative;
}
.dropdown-menu .dropdown-submenu {
  display: none;
  position: absolute;
  left: 100%;
  top: -7px;
}
.dropdown-menu .dropdown-submenu-left {
  right: 100%;
  left: auto;
}
.dropdown-menu > li:hover > .dropdown-submenu {
  display: block;
}
</style>