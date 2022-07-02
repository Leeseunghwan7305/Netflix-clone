import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoviesResult } from "../../api/api";
import { makeImagePath } from "../../util/utils";
const Wrapper = styled.div`
  background-color: black;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  color: white;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  overflow-x: hidden;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
  width: 50%;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ backimg: string }>`
  height: 200px;
  font-size: 66px;
  background-image: url(${(props) => props.backimg});
  background-size: cover;
  position: relative;
  :first-child {
    transform-origin: center left;
  }
  :last-child {
    transform-origin: center right;
  }
`;
const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;
//relative?
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const BoxVari = {
  start: {},
  end: {},
  hover: {
    zIndex: 200,
    scale: 1.3,
    y: -25,
    transition: {
      delay: 0.3,
      duration: 0.3,
      type: "tween",
    },
    opacity: 1,
  },
};
const DetailBox = styled(motion.div)`
  width: 40vw;
  height: 80vh;
  background-color: black;
  position: absolute;
  top: 100px;
  margin: 0 auto;
  left: 0;
  right: 0;
  border-radius: 15px;
  color: white;
`;
const OverLay = styled(motion.div)`
  position: fixed;
  width: 100vw;
  top: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
`;
const DetailImg = styled.img`
  width: 100%;
  height: 50%;
  border-top-right-radius: 15px;
  border-top-left-radius: 15px;
`;
const rowVariants = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth + 10,
  },
};
const Home = () => {
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["playing", "nowPlaying"],
    getMovies
  );

  const { scrollY } = useViewportScroll();
  const navigate = useNavigate();
  //useMatch 써도 되고 Outlet 써도 되고
  const detailMovie = useMatch(`/movies/:movieId`);
  const clickedMovie: any =
    detailMovie?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === detailMovie.params.movieId
    );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const incraseIndex = () => {
    if (!leaving) {
      if (data) {
        setLeaving(true);
        setIndex((prev) =>
          (1 + index) * offset >= data.results.length - 2 ? 0 : prev + 1
        );
      }
    } else {
      return;
    }
  };
  const MoveDetailMovie = (id: number) => {
    navigate(`/movies/${id}`);
  };
  const ToggleOverLay = () => {
    navigate("/");
  };
  const offset = 6; // 6칸씩 띄게할것임 19개의 영화

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={incraseIndex}
            bgPhoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence
              initial={false}
              onExitComplete={() => setLeaving(false)}
            >
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(0, -1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      variants={BoxVari}
                      whileHover="hover"
                      layoutId={movie.id + ""}
                      onClick={() => MoveDetailMovie(movie.id)}
                      backimg={makeImagePath(movie.backdrop_path, "w500")}
                      key={movie.id}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {detailMovie ? (
              <>
                <OverLay
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={ToggleOverLay}
                ></OverLay>
                <DetailBox
                  style={{ top: scrollY.get() + 125 }}
                  layoutId={detailMovie.params.movieId + ""}
                >
                  <DetailImg
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <nav>{clickedMovie.title}</nav>
                  <div>{clickedMovie.overview}</div>
                </DetailBox>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
