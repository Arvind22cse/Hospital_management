"use client"

import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Eye, AlertCircle } from 'lucide-react'

// Styles for the component
const styles = {
  card: {
    backgroundColor: "white",
    borderRadius: "0.5rem",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: "180px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease",
  },
  severityIndicator: {
    position: "absolute",
    top: "0.75rem",
    right: "0.75rem",
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.25rem 0.5rem",
    borderRadius: "1rem",
    fontSize: "0.75rem",
    fontWeight: 600,
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  severityHigh: {
    backgroundColor: "rgba(239, 68, 68, 0.9)",
    color: "white",
  },
  severityMedium: {
    backgroundColor: "rgba(245, 158, 11, 0.9)",
    color: "white",
  },
  severityLow: {
    backgroundColor: "rgba(16, 185, 129, 0.9)",
    color: "white",
  },
  cardContent: {
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  cardTitle: {
    fontSize: "1.125rem",
    fontWeight: 600,
    margin: "0 0 0.75rem",
    lineHeight: 1.3,
  },
  titleLink: {
    color: "#1a1a1a",
    textDecoration: "none",
    transition: "color 0.2s ease",
    "&:hover": {
      color: "#3b82f6",
    },
  },
  symptomsPreview: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginBottom: "1rem",
  },
  symptomChip: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    fontSize: "0.75rem",
    borderRadius: "1rem",
  },
  moreSymptoms: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    backgroundColor: "#e5e7eb",
    color: "#6b7280",
    fontSize: "0.75rem",
    borderRadius: "1rem",
  },
  cardActions: {
    marginTop: "auto",
    paddingTop: "0.75rem",
  },
  viewDetailsButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    padding: "0.75rem 1rem",
    backgroundColor: "#f3f4f6",
    color: "#4b5563",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "0.875rem",
    fontWeight: 500,
    textDecoration: "none",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#3b82f6",
      color: "white",
    },
  },
}

export default function productCard({ disease, index }) {
  // Determine severity color
  const getSeverityStyle = (severity) => {
    if (!severity) return {}

    switch (severity.toLowerCase()) {
      case "high":
        return styles.severityHigh
      case "medium":
        return styles.severityMedium
      case "low":
        return styles.severityLow
      default:
        return {}
    }
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1, // Stagger effect based on index
      },
    },
    hover: {
      y: -10,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.2 },
    },
  }

  return (
    <motion.div 
      style={styles.card} 
      variants={cardVariants} 
      whileHover="hover"
    >
      <div style={styles.imageContainer}>
        <motion.img 
          src={disease.images[0].image || "/placeholder.svg"} 
          alt={disease.name} 
          style={styles.image}
          // whileHover={{ transform: "scale(1.05)" }}
        />

        {disease.severity && (
          <div style={{
            ...styles.severityIndicator,
            ...getSeverityStyle(disease.severity),
          }}>
            <AlertCircle size={14} />
            <span>{disease.severity}</span>
          </div>
        )}
      </div>

      <div style={styles.cardContent}>
        <h3 style={styles.cardTitle}>
          <Link 
            to={`/general/${disease._id}`} 
            style={{ 
              color: "#1a1a1a", 
              textDecoration: "none",
              transition: "color 0.2s ease",
            }}
            onMouseOver={(e) => e.target.style.color = "#3b82f6"}
            onMouseOut={(e) => e.target.style.color = "#1a1a1a"}
          >
            {disease.name}
          </Link>
        </h3>

        {disease.symptoms && disease.symptoms.length > 0 && (
          <div style={styles.symptomsPreview}>
            {disease.symptoms.slice(0, 2).map((symptom, i) => (
              <span key={i} style={styles.symptomChip}>
                {symptom}
              </span>
            ))}
            {disease.symptoms.length > 2 && (
              <span style={styles.moreSymptoms}>
                +{disease.symptoms.length - 2}
              </span>
            )}
          </div>
        )}

        <motion.div
          style={styles.cardActions}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link 
            to={`/general/${disease._id}`} 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              width: "100%",
              padding: "0.75rem 1rem",
              backgroundColor: "#f3f4f6",
              color: "#4b5563",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = "#3b82f6"
              e.target.style.color = "white"
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = "#f3f4f6"
              e.target.style.color = "#4b5563"
            }}
          >
            <Eye size={16} />
            <span>View Details</span>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  )
}
