function Navbar() {
    return <>
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <li class="nav-link" data-widget="pushmenu" role="button"><i class="fas fa-bars"></i></li>
                </li>
            </ul>

            <ul class="navbar-nav ml-auto">
                <li class="nav-item">
                    <div class="navbar-search-block">
                        <form class="form-inline">
                            <div class="input-group input-group-sm">
                                <input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
                                <div class="input-group-append">
                                    <button class="btn btn-navbar" type="submit">
                                        <i class="fas fa-search"></i>
                                    </button>
                                    <button class="btn btn-navbar" type="button" data-widget="navbar-search">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </li>

                <li class="nav-item dropdown">
                    <li class="nav-link" data-toggle="dropdown">
                        <i class="far fa-bell"></i>
                        <span class="badge badge-warning navbar-badge">15</span>
                    </li>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                        <span class="dropdown-item dropdown-header">15 Notifications</span>
                        <div class="dropdown-divider"></div>
                        <li class="dropdown-item">
                            <i class="fas fa-envelope mr-2"></i> 4 new messages
                            <span class="float-right text-muted text-sm">3 mins</span>
                        </li>
                        <div class="dropdown-divider"></div>
                        <li class="dropdown-item">
                            <i class="fas fa-users mr-2"></i> 8 friend requests
                            <span class="float-right text-muted text-sm">12 hours</span>
                        </li>
                        <div class="dropdown-divider"></div>
                        <li class="dropdown-item">
                            <i class="fas fa-file mr-2"></i> 3 new reports
                            <span class="float-right text-muted text-sm">2 days</span>
                        </li>
                        <div class="dropdown-divider"></div>
                        <li class="dropdown-item dropdown-footer">See All Notifications</li>
                    </div>
                </li>
                <li class="nav-item">
                    <li class="nav-link" data-widget="fullscreen" role="button">
                        <i class="fas fa-expand-arrows-alt"></i>
                    </li>
                </li>
            </ul>
        </nav>
    </>
}

export default Navbar;