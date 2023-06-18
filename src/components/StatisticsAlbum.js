import React from "react";
import { useParams } from "react-router-dom";
import { getStatisticsOfAlbum } from "../API-utils/endpointsManageRates";
import { useQuery } from "react-query";
import { Star } from "@material-ui/icons";

const StatisticsAlbum = () => {
  const { id_music_album } = useParams();

  const { status, data: statisticsAlbum } = useQuery(
    ["statistics-album", id_music_album],
    () => getStatisticsOfAlbum(id_music_album),
    {
      retry: 0,
      refetchOnWindowFocus: false,
    }
  );

  let contentStatistics;

  if (status === "success") {
    contentStatistics = (
      <>
        {statisticsAlbum.quantity === 0 ? (
          <div className="statistics__box">
            <Star className="star-icon-stats" />
            <p>Brak ocen</p>
          </div>
        ) : (
          <div className="statistics__container">
            <div className="statistics__box">
              <Star className="star-icon-stats" />
              <p className="statistics__mean">
                {parseFloat(statisticsAlbum.mean).toFixed(2)}
              </p>
            </div>
            <div className="statistics__box statistics__box--flexDirection">
              <p className="statistics__item statistics__item--textAlign">
                Liczba ocen
              </p>
              <p className="statistics__item statistics__item--textAlign">
                {statisticsAlbum.quantity}
              </p>
            </div>
          </div>
        )}
      </>
    );
  }

  return <section className="statistics">{contentStatistics}</section>;
};

export default StatisticsAlbum;
