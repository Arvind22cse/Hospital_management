"use client"

import { Fragment, useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Search, ArrowLeft, WormIcon as Virus, Loader2 } from 'lucide-react'
import ProductCard from "../components/productCard.jsx"

// Styles for the component
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "2rem 1.5rem",
  },
  header: {
    marginBottom: "2rem",
  },
  backButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  title: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1a1a1a",
    margin: "1.5rem 0",
  },
  titleIcon: {
    color: "#3b82f6",
  },
  searchContainer: {
    position: "relative",
    maxWidth: "500px",
    margin: "1.5rem 0",
  },
  searchIcon: {
    position: "absolute",
    left: "1rem",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    pointerEvents: "none",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    fontSize: "0.95rem",
    borderRadius: "0.5rem",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    color: "#374151",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
    transition: "all 0.2s ease",
    "&:focus": {
      outline: "none",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.2)",
    },
  },
  detailsSection: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    padding: "2rem",
    marginBottom: "2rem",
    overflow: "hidden",
    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  },
  detailsContent: {
    flex: 1.5,
  },
  detailsTitle: {
    fontSize: "1.5rem",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "1rem",
  },
  detailsText: {
    fontSize: "1rem",
    color: "#4b5563",
    lineHeight: 1.7,
  },
  detailsImageContainer: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  detailsImage: {
    maxWidth: "100%",
    maxHeight: "300px",
    objectFit: "contain",
    borderRadius: "0.5rem",
  },
  diseasesCount: {
    fontSize: "0.95rem",
    color: "#6b7280",
    marginBottom: "1rem",
  },
  diseasesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "1.5rem",
    "@media (max-width: 768px)": {
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    },
    "@media (max-width: 480px)": {
      gridTemplateColumns: "1fr",
    },
  },
  noResults: {
    textAlign: "center",
    padding: "3rem 0",
    color: "#6b7280",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 0",
    color: "#6b7280",
    gap: "1rem",
  },
}

export default function General() {
  const [diseases, setDiseases] = useState([])
  const [searchParams] = useSearchParams()
  const [details, setDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)

    // Fetch disease data
    fetch("http://localhost:7000/api/v1/diseases?" + searchParams)
      .then((res) => res.json())
      .then((res) => {
        setDiseases(res.diseases)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching diseases:", error)
        setLoading(false)
      })

    // Fetch paragraph and image data
    fetch("http://localhost:7000/api/v1/details")
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.details.length > 0) {
          setDetails(res.details[0])
        }
      })
      .catch((error) => {
        console.error("Error fetching details:", error)
      })
  }, [searchParams])

  const handleBack = () => {
    navigate(-1)
  }

  const filteredDiseases = diseases.filter((disease) => disease.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <Fragment>
      <div style={styles.container}>
        <motion.div
          style={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.button
            style={styles.backButton}
            onClick={handleBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </motion.button>

          <motion.h1
            style={styles.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Virus style={styles.titleIcon} />
            Disease Information Center
          </motion.h1>

          <motion.div
            style={styles.searchContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Search style={styles.searchIcon} size={18} />
            <input
              type="text"
              placeholder="Search diseases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "0.75rem 1rem 0.75rem 2.5rem",
                fontSize: "0.95rem",
                borderRadius: "0.5rem",
                border: "1px solid #e5e7eb",
                backgroundColor: "white",
                color: "#374151",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.target.style.outline = "none"
                e.target.style.borderColor = "#3b82f6"
                e.target.style.boxShadow = "0 0 0 3px rgba(59, 130, 246, 0.2)"
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e5e7eb"
                e.target.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.05)"
              }}
            />
          </motion.div>
        </motion.div>

        {details && (
          <motion.div
            style={{
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              gap: "2rem",
              backgroundColor: "white",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
              padding: "2rem",
              marginBottom: "2rem",
              overflow: "hidden",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div style={{ flex: 1.5 }}>
              <h2 style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#1a1a1a",
                marginBottom: "1rem",
              }}>
                {details.title || "About Diseases"}
              </h2>
              <p style={{
                fontSize: "1rem",
                color: "#4b5563",
                lineHeight: 1.7,
              }}>
                {details.description ||
                  "Learn about various diseases, their symptoms, treatments, and prevention methods."}
              </p>
            </div>
            {details.image && (
              <div style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <img 
                  src={details.image || "/placeholder.svg"} 
                  alt="Disease Information" 
                  style={{
                    maxWidth: "100%",
                    maxHeight: "300px",
                    objectFit: "contain",
                    borderRadius: "0.5rem",
                  }} 
                />
              </div>
            )}
          </motion.div>
        )}

        <section>
          {loading ? (
            <div style={styles.loadingContainer}>
              <Loader2 
                size={48} 
                style={{ animation: "spin 1.5s linear infinite" }} 
              />
              <p>Loading diseases...</p>
            </div>
          ) : (
            <>
              <motion.div
                style={styles.diseasesCount}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Showing {filteredDiseases.length} {filteredDiseases.length === 1 ? "disease" : "diseases"}
              </motion.div>

              <motion.div 
                style={{
                  display: "grid",
                  gridTemplateColumns: window.innerWidth < 480 
                    ? "1fr" 
                    : window.innerWidth < 768 
                      ? "repeat(auto-fill, minmax(200px, 1fr))" 
                      : "repeat(auto-fill, minmax(250px, 1fr))",
                  gap: "1.5rem",
                }}
                variants={containerVariants} 
                initial="hidden" 
                animate="visible"
              >
                {filteredDiseases.map((disease, index) => (
                  <ProductCard key={disease._id} disease={disease} index={index} />
                ))}
              </motion.div>

              {filteredDiseases.length === 0 && (
                <motion.div 
                  style={styles.noResults} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                >
                  <p>No diseases found matching your search.</p>
                </motion.div>
              )}
            </>
          )}
        </section>
      </div>
    </Fragment>
  )
}
