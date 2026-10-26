import { artworkUrl, formatNumber } from '../../lib/format'
import TypeBadge from '../TypeBadge'
import './Hero.css'

// 상세 페이지 맨 위. 종 정보(detail)와 지금 보고 있는 모습(form)을 받는다.
function Hero({ detail, form }) {
  return (
    <section className="hero">
      <img
        className="hero__image"
        src={artworkUrl(form.pokemonId)}
        alt={detail.name}
        width="200"
        height="200"
      />
      <div className="hero__body">
        <div className="hero__number">{formatNumber(detail.id)}</div>
        <h1 className="hero__name">
          {detail.name}
          {detail.isLegendary && <span className="hero__tag">전설</span>}
          {detail.isMythical && <span className="hero__tag">환상</span>}
        </h1>
        <div className="hero__genus">{detail.genus}</div>
        <div className="hero__types">
          {form.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
        <dl className="hero__facts">
          <div>
            <dt>키</dt>
            <dd>{form.heightM}m</dd>
          </div>
          <div>
            <dt>몸무게</dt>
            <dd>{form.weightKg}kg</dd>
          </div>
          <div>
            <dt>세대</dt>
            <dd>{detail.generation}세대</dd>
          </div>
        </dl>
        <p className="hero__text">{detail.flavorText || '한국어 도감 설명이 없어요.'}</p>
      </div>
    </section>
  )
}

export default Hero
