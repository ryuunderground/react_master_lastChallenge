import { useQuery } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { IGetTvsResult, getTvs } from "../api";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";

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
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 48px;
  margin-bottom: 10px;
`;
const Overview = styled.p`
  font-size: 20px;
  width: 50%;
`;
const Sliders = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  gap: 200px;
`;
const SliderTitle = styled.h1`
  font-size: 26px;
  padding: 10px;
  background-color: black;
`;
const Slider = styled.div`
  position: relative;
  top: -100px;
  height: 100%;
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  height: 200px;
  font-size: 36px;
  background-image: url(${(props) => props.bgPhoto});
  background: cover;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px 0;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 12px;
  }
`;

const Bigtv = styled(motion.div)`
  background-color: ${(props) => props.theme.black.lighter};
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 300px;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 46px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  opacity: 0;
`;

//Variants
const rowVars = {
  hidden: {
    x: window.outerWidth + 10,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -1 * window.outerWidth - 10,
  },
};
const boxVars = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -20,
    transition: {
      delay: 0.2,
      type: "tween",
      duration: 0.3,
    },
  },
};
const infoVars = {
  hover: {
    opacity: 1,
    zIndex: 99,

    transition: {
      delay: 0.2,
      type: "tween",
      duration: 0.3,
    },
  },
};

//main Fn
const Tv = () => {
  const navigate = useNavigate();
  const bigtvMatch = useMatch("react_master_graduate/tv/:showId");
  const { scrollY } = useScroll();
  const { data: tvNowPlaying, isLoading: tvNowLoading } =
    useQuery<IGetTvsResult>(["tv", "nowPlaying"], () =>
      getTvs("en-US", "airing_today")
    );
  const { data: tvOncoming, isLoading: tvOnLoading } = useQuery<IGetTvsResult>(
    ["tv", "onTheAir"],
    () => getTvs("en-US", "on_the_air")
  );
  const { data: tvTopRated, isLoading: tvTopLoading } = useQuery<IGetTvsResult>(
    ["tv", "topRated"],
    () => getTvs("en-US", "top_rated")
  );
  const { data: tvPopular, isLoading: tvPopularLoading } =
    useQuery<IGetTvsResult>(["tv", "popular"], () =>
      getTvs("en-US", "popular")
    );
  const [index, setIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);
  const increaseIndex = () => {
    if (tvNowPlaying) {
      if (isLeaving) return;
      toggleLeaving();
      const totalTvs = tvNowPlaying.results.length - 1;
      const maxIndex = Math.floor(totalTvs / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => {
    setIsLeaving((prev) => !prev);
  };
  const offset = 6;
  const onBoxClicked = (showId: number) => {
    navigate(`/react_master_graduate/tv/${showId}`);
  };
  const onOverlayClicked = () => {
    navigate(-1);
  };
  const clickedtvNow =
    bigtvMatch?.params.showId &&
    tvNowPlaying?.results.find(
      (tv) => String(tv.id) === bigtvMatch?.params.showId
    );
  const clickedtvOn =
    bigtvMatch?.params.showId &&
    tvOncoming?.results.find(
      (tv) => String(tv.id) === bigtvMatch?.params.showId
    );
  const clickedtvTop =
    bigtvMatch?.params.showId &&
    tvTopRated?.results.find(
      (tv) => String(tv.id) === bigtvMatch?.params.showId
    );
  const clickedtvPop =
    bigtvMatch?.params.showId &&
    tvPopular?.results.find(
      (tv) => String(tv.id) === bigtvMatch?.params.showId
    );

  return (
    <Wrapper>
      {tvNowLoading ? (
        <Loader></Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(
              tvNowPlaying?.results[0].backdrop_path || ""
            )}
          >
            <Title>{tvNowPlaying?.results[0].original_name}</Title>
            <Overview>{tvNowPlaying?.results[0].overview}</Overview>
          </Banner>
          <Sliders>
            {/* Airing Today*/}
            <Slider>
              <SliderTitle>Airing Today</SliderTitle>
              <AnimatePresence onExitComplete={toggleLeaving} initial={false}>
                <Row
                  variants={rowVars}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={index}
                >
                  {tvNowPlaying?.results
                    .slice(1)
                    .slice(offset * index, offset * index + offset)
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + ""}
                        key={tv.id}
                        bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVars}
                        transition={{ type: "tween" }}
                        onClick={() => onBoxClicked(tv.id)}
                      >
                        <Info variants={infoVars}>
                          <h4>{tv.original_name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
            </Slider>
            <AnimatePresence>
              {bigtvMatch ? (
                <>
                  <Overlay
                    onClick={onOverlayClicked}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  ></Overlay>
                  <Bigtv
                    layoutId={bigtvMatch?.params.showId + ""}
                    style={{ top: scrollY.get() + 100 }}
                  >
                    {clickedtvNow && (
                      <>
                        <BigCover
                          style={{
                            backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                              clickedtvNow.backdrop_path,
                              "w500"
                            )})`,
                          }}
                        />
                        <BigTitle>{clickedtvNow.original_name}</BigTitle>
                        <BigOverview>{clickedtvNow.overview}</BigOverview>
                      </>
                    )}
                  </Bigtv>
                </>
              ) : null}
            </AnimatePresence>
            {/* On the Air*/}
            {tvOnLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Slider>
                  <SliderTitle>On the Air</SliderTitle>
                  <AnimatePresence
                    onExitComplete={toggleLeaving}
                    initial={false}
                  >
                    <Row
                      variants={rowVars}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "tween", duration: 1 }}
                      key={index}
                    >
                      {tvOncoming?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((tv) => (
                          <Box
                            layoutId={tv.id + ""}
                            key={tv.id}
                            bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClicked(tv.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{tv.original_name}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigtvMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <Bigtv
                        layoutId={bigtvMatch?.params.showId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedtvOn && (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedtvOn.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedtvOn.original_name}</BigTitle>
                            <BigOverview>{clickedtvOn.overview}</BigOverview>
                          </>
                        )}
                      </Bigtv>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {/* Top Rated*/}
            {tvTopLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Slider>
                  <SliderTitle>Top Rated</SliderTitle>
                  <AnimatePresence
                    onExitComplete={toggleLeaving}
                    initial={false}
                  >
                    <Row
                      variants={rowVars}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "tween", duration: 1 }}
                      key={index}
                    >
                      {tvTopRated?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((tv) => (
                          <Box
                            layoutId={tv.id + ""}
                            key={tv.id}
                            bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClicked(tv.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{tv.original_name}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigtvMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <Bigtv
                        layoutId={bigtvMatch?.params.showId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedtvTop && (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedtvTop.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedtvTop.original_name}</BigTitle>
                            <BigOverview>{clickedtvTop.overview}</BigOverview>
                          </>
                        )}
                      </Bigtv>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            {/* Popular */}
            {tvPopularLoading ? (
              <Loader>Loading...</Loader>
            ) : (
              <>
                <Slider>
                  <SliderTitle>Popular</SliderTitle>
                  <AnimatePresence
                    onExitComplete={toggleLeaving}
                    initial={false}
                  >
                    <Row
                      variants={rowVars}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ type: "tween", duration: 1 }}
                      key={index}
                    >
                      {tvPopular?.results
                        .slice(1)
                        .slice(offset * index, offset * index + offset)
                        .map((tv) => (
                          <Box
                            layoutId={tv.id + ""}
                            key={tv.id}
                            bgPhoto={makeImagePath(tv.backdrop_path, "w500")}
                            whileHover="hover"
                            initial="normal"
                            variants={boxVars}
                            transition={{ type: "tween" }}
                            onClick={() => onBoxClicked(tv.id)}
                          >
                            <Info variants={infoVars}>
                              <h4>{tv.original_name}</h4>
                            </Info>
                          </Box>
                        ))}
                    </Row>
                  </AnimatePresence>
                </Slider>
                <AnimatePresence>
                  {bigtvMatch ? (
                    <>
                      <Overlay
                        onClick={onOverlayClicked}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      ></Overlay>
                      <Bigtv
                        layoutId={bigtvMatch?.params.showId + ""}
                        style={{ top: scrollY.get() + 100 }}
                      >
                        {clickedtvPop && (
                          <>
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedtvPop.backdrop_path,
                                  "w500"
                                )})`,
                              }}
                            />
                            <BigTitle>{clickedtvPop.original_name}</BigTitle>
                            <BigOverview>{clickedtvPop.overview}</BigOverview>
                          </>
                        )}
                      </Bigtv>
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
          </Sliders>
        </>
      )}

      <ReactQueryDevtools initialIsOpen={true} />
    </Wrapper>
  );
};

export default Tv;
