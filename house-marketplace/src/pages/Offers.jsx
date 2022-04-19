import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import {collection, getDocs, query, where, orderBy, limit, startAfter} from 'firebase/firestore'
import {db} from '../firebase.config'
import { toast } from "react-toastify"
import Spinner from '../components/Spinner'
import ListingItem from "../components/ListingItem"

const Offers = () => {
  
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      
      try {
        //Get a reference
        const listingsRef = collection(db, 'listings')
        
        //Create a query
        const q = query(listingsRef, 
         where('offer', '==', true),
         orderBy('timestamp', 'desc'), 
         limit(10)
         )

         //Execute the query and get a snapshot
         const querySnap = await getDocs(q)

        //  Loop through the snapshot and get the data
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          })
        })

        // Set the data to our state
        setListings(listings)
        setLoading(false)

      } catch (error) {
          toast.error('Could not fetch Listings')
      }

    }

    fetchListings()

  }, [params.categoryName])


  return (

    <div className="category">

      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>

      {loading ? <Spinner /> : listings && listings.length > 0 ?
        <>
          <main>
            <ul className="categoryListings">
              {listings.map( (listing) => (
                <ListingItem listing={listing.data} id={listing.id} key={listing.id}/>
              ))} 
            </ul>
          </main>
        </>
        : <p>There are no current offers</p>}

    </div>
  )
}
export default Offers