import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useQuery } from "react-query";
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

const Box = styled(motion.div)<{ backImg: string }>`
  height: 200px;
  font-size: 66px;
  background-image: url(${(props) => props.backImg});
  background-size: cover;
  :first-child {
    transform-origin: center left;
  }
  :last-child {
    transform-origin: center right;
  }
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
                      whileHover={{
                        scale: 1.3,
                        y: -25,
                        transition: {
                          delay: 0.3,
                          duration: 0.3,
                          type: "tween",
                        },
                      }}
                      backImg={makeImagePath(movie.backdrop_path, "w500")}
                      key={movie.id}
                    ></Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
};

export default Home;
