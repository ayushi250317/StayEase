import {GearIcon} from '@radix-ui/react-icons';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@src/src/components/ui/avatar';
import {Button} from '@src/src/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@src/src/components/ui/menubar';
import {useUserStore} from '@src/store/user';
import {
  FaBuilding,
  FaCar,
  FaHeart,
  FaHome,
  FaLocationArrow,
  FaTree,
  FaUndo,
  FaUser,
  FaUserAlt,
} from 'react-icons/fa';
import {Link, Outlet, useNavigate} from 'react-router-dom';

export const LandingLayout = () => {
  const navigate = useNavigate();

  const {isLoggedIn, user, logout} = useUserStore();

  return (
    <div className="flex flex-col h-screen">
      {/* NAVIGATION */}
      <div className="p-5 text-white flex items-center shadow-md">
        <h1
          className="text-xl font-semibold font-mono cursor-pointer flex items-center gap-2 text-primary"
          onClick={() => navigate('/')}
        >
          <FaTree />
          StayEase
        </h1>
        <div className="ml-auto flex items-center gap-8">
          <div
            className="text-black flex items-center gap-2 text-xs text-muted-foreground cursor-pointer"
            onClick={() => navigate(`/properties-by-location`)}
          >
            <FaLocationArrow />
            Properties By Location
          </div>
          {!isLoggedIn && (
            <>
              {' '}
              <p
                className="cursor-pointer text-secondary-foreground"
                onClick={() => navigate('/signin')}
              >
                Sign in
              </p>
              <Button onClick={() => navigate('/signup')}>Sign up</Button>
            </>
          )}
          {isLoggedIn && (
            <Menubar className="border-0">
              <MenubarMenu>
                <MenubarTrigger>
                  <Avatar className="cursor-pointer text-secondary-foreground">
                    <AvatarImage src={user?.userAvatar} />
                    <AvatarFallback>{user?.fullName[0]}</AvatarFallback>
                  </Avatar>
                </MenubarTrigger>
                <MenubarContent>
                  <MenubarItem
                    className="flex items-center gap-2"
                    onClick={() => navigate(`/profile`)}
                  >
                    <FaUser />
                    Profile
                  </MenubarItem>
                  {user?.userType?.toUpperCase() === 'ADMIN' && (
                    <>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/admin`)}
                      >
                        <FaUserAlt />
                        Admin
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/add-property`)}
                      >
                        <FaHome />
                        Add Property
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/manage`)}
                      >
                        <FaBuilding />
                        Manage Property
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/reservations`)}
                      >
                        <GearIcon />
                        Manage Reservations
                      </MenubarItem>
                    </>
                  )}
                  {user?.userType?.toUpperCase() !== 'ADMIN' && (
                    <>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/wishlist`)}
                      >
                        <FaHeart />
                        Wishlist
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/trips`)}
                      >
                        <FaCar />
                        Trip History
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/manage-trips`)}
                      >
                        <FaUndo />
                        Upcoming Trips
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/add-property`)}
                      >
                        <FaHome />
                        Add Property
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/manage`)}
                      >
                        <FaBuilding />
                        Manage Property
                      </MenubarItem>
                      <MenubarItem
                        className="flex items-center gap-2"
                        onClick={() => navigate(`/reservations`)}
                      >
                        <GearIcon />
                        Manage Reservations
                      </MenubarItem>
                    </>
                  )}
                  <MenubarItem onClick={() => logout()}>Logout</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          )}
        </div>
      </div>
      <div className="container mx-auto py-10">
        <Outlet />
      </div>
      {/* FOOTER */}
      <div className="bg-primary text-primary-foreground px-10 py-5 mt-auto">
        <div className="container flex gap-5 items-center justify-center">
          <b>© 2024 StayEase</b>.<Link to="/faq">FAQ</Link>.
          <Link to="/contact">Contact Us</Link>
        </div>
      </div>
    </div>
  );
};
