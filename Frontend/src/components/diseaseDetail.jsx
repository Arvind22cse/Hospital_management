"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, AlertCircle, Thermometer, Stethoscope, ShieldCheck, Calendar, Loader2 } from 'lucide-react'

// Styles for the component
const styles = {
  container: {
    maxWidth: "1200px",
    margin: "2rem auto",
    padding: "0 1.5rem",
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
    marginBottom: "1.5rem",
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
  errorContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "4rem 0",
    gap: "1rem",
  },
  detailContent: {
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    backgroundColor: "#ffffff",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    overflow: "hidden",
    "@media (min-width: 768px)": {
      flexDirection: "row",
    },
  },
  imageContainer: {
    position: "relative",
    flex: 1,
    minHeight: "300px",
    maxHeight: "500px",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  severityBadge: {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "2rem",
    fontSize: "0.875rem",
    fontWeight: 600,
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  infoSection: {
    flex: 1,
    padding: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#1a1a1a",
    marginBottom: "1.5rem",
    position: "relative",
  },
  titleAfter: {
    content: '""',
    position: "absolute",
    bottom: "-0.5rem",
    left: 0,
    width: "60px",
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
    borderRadius: "2px",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: "1.5rem",
    marginBottom: "2rem",
    "@media (min-width: 640px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
  },
  infoCard: {
    display: "flex",
    gap: "1rem",
    padding: "1.25rem",
    backgroundColor: "#f9fafb",
    borderRadius: "0.5rem",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f3f4f6",
      transform: "translateY(-2px)",
    },
  },
  infoIcon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    backgroundColor: "#3b82f6",
    color: "white",
    borderRadius: "50%",
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: "1rem",
    fontWeight: 600,
    color: "#1a1a1a",
    margin: "0 0 0.5rem",
  },
  infoText: {
    fontSize: "0.95rem",
    color: "#4b5563",
    margin: 0,
    lineHeight: 1.6,
  },
  symptomsList: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
    marginTop: "0.5rem",
  },
  symptomTag: {
    display: "inline-block",
    padding: "0.25rem 0.75rem",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "#3b82f6",
    fontSize: "0.875rem",
    borderRadius: "2rem",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      transform: "translateY(-2px)",
    },
  },
  registerButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    width: "100%",
    padding: "0.875rem 1.5rem",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "0.5rem",
    fontSize: "1rem",
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s ease",
    marginTop: "1rem",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
  },
}

export default function diseaseDetail() {
  const [disease, setDisease] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:7000/api/v1/disease/${id}`)
      .then((res) => res.json())
      .then((res) => {
        setDisease(res.disease)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching disease details:", error)
        setLoading(false)
      })
  }, [id])

  const handleBack = () => {
    navigate(-1)
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <Loader2 
          size={48} 
          style={{ animation: "spin 1.5s linear infinite" }} 
        />
        <p>Loading disease information...</p>
      </div>
    )
  }

  if (!disease) {
    return (
      <div style={styles.errorContainer}>
        <AlertCircle size={48} style={{ color: "#ef4444" }} />
        <h3>Disease information not found</h3>
        <button style={styles.backButton} onClick={handleBack}>
          <ArrowLeft size={16} />
          <span>Go Back</span>
        </button>
      </div>
    )
  }

  // Determine severity color
  const getSeverityColor = (severity) => {
    switch (severity.toLowerCase()) {
      case "high":
        return { backgroundColor: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }
      case "medium":
        return { backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }
      case "low":
        return { backgroundColor: "rgba(16, 185, 129, 0.1)", color: "#10b981" }
      default:
        return { backgroundColor: "rgba(59, 130, 246, 0.1)", color: "#3b82f6" }
    }
  }

  const severityStyle = getSeverityColor(disease.severity)

  return (
    <div style={styles.container}>
      <motion.button
        style={styles.backButton}
        onClick={handleBack}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={16} />
        <span>Back to Diseases</span>
      </motion.button>

      <div style={{ 
        display: "flex", 
        flexDirection: window.innerWidth < 768 ? "column" : "row",
        gap: "2rem",
        backgroundColor: "#ffffff",
        borderRadius: "0.5rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
        overflow: "hidden",
      }}>
        <motion.div
          style={styles.imageContainer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={disease.images[0].image || "/placeholder.svg"} 
            alt={disease.name} 
            style={styles.image} 
          />
          <motion.div
            style={{
              ...styles.severityBadge,
              ...severityStyle,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <AlertCircle size={16} />
            <span>{disease.severity} Severity</span>
          </motion.div>
        </motion.div>

        <motion.div
          style={styles.infoSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.h1 
            style={styles.title}
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {disease.name}
            <span style={styles.titleAfter}></span>
          </motion.h1>

          <div style={{ 
            display: "grid",
            gridTemplateColumns: window.innerWidth < 640 ? "1fr" : "repeat(2, 1fr)",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}>
            <motion.div
              style={styles.infoCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -5, backgroundColor: "#f3f4f6" }}
            >
              <div style={styles.infoIcon}>
                <AlertCircle size={20} />
              </div>
              <div style={styles.infoContent}>
                <h3 style={styles.infoTitle}>Description</h3>
                <p style={styles.infoText}>{disease.description}</p>
              </div>
            </motion.div>

            <motion.div
              style={styles.infoCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              whileHover={{ y: -5, backgroundColor: "#f3f4f6" }}
            >
              <div style={styles.infoIcon}>
                <Thermometer size={20} />
              </div>
              <div style={styles.infoContent}>
                <h3 style={styles.infoTitle}>Symptoms</h3>
                <div style={styles.symptomsList}>
                  {disease.symptoms.map((symptom, index) => (
                    <motion.span 
                      key={index} 
                      style={styles.symptomTag}
                      whileHover={{ y: -2, backgroundColor: "rgba(59, 130, 246, 0.2)" }}
                    >
                      {symptom}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              style={styles.infoCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{ y: -5, backgroundColor: "#f3f4f6" }}
            >
              <div style={styles.infoIcon}>
                <Stethoscope size={20} />
              </div>
              <div style={styles.infoContent}>
                <h3 style={styles.infoTitle}>Treatment</h3>
                <p style={styles.infoText}>{disease.treatment}</p>
              </div>
            </motion.div>

            <motion.div
              style={styles.infoCard}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              whileHover={{ y: -5, backgroundColor: "#f3f4f6" }}
            >
              <div style={styles.infoIcon}>
                <ShieldCheck size={20} />
              </div>
              <div style={styles.infoContent}>
                <h3 style={styles.infoTitle}>Prevention</h3>
                <p style={styles.infoText}>{disease.prevention}</p>
              </div>
            </motion.div>
          </div>

          {/* <motion.button
            style={styles.registerButton}
            onClick={() => navigate(`/register/${id}`)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.05, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <Calendar size={18} />
            <span>Online Registration</span>
          </motion.button> */}
        </motion.div>
      </div>
    </div>
  )
}
