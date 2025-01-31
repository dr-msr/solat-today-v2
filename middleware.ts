import { geolocation } from '@vercel/functions'
import { type NextRequest, NextResponse } from 'next/server'
import countries from './lib/countries.json'

// run only on homepage
export const config = {
  matcher: '/',
}

export async function middleware(req: NextRequest) {
  const { nextUrl: url } = req
  const geo = geolocation(req)
  const country = geo.country || 'US'
  const city = geo.city || 'San Francisco'
  const region = geo.countryRegion || 'CA'
  const lat = geo.latitude || 37.7749
  const lon = geo.longitude || -122.4194

  const countryInfo = countries.find((x) => x.cca2 === country)

  const currencyCode = Object.keys(countryInfo.currencies)[0]
  const currency = countryInfo.currencies[currencyCode]
  const languages = Object.values(countryInfo.languages).join(', ')

  url.searchParams.set('country', country)
  url.searchParams.set('city', city)
  url.searchParams.set('region', region)
  url.searchParams.set('currencyCode', currencyCode)
  url.searchParams.set('currencySymbol', currency.symbol)
  url.searchParams.set('name', currency.name)
  url.searchParams.set('languages', languages)
  url.searchParams.set('latitude', lat.toString())
  url.searchParams.set('longitude', lon.toString())


  return NextResponse.rewrite(url)
}
